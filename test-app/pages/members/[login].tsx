import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'

export default function Member({ user }) {
  // Query from the url localhost/members/{login_query}
  const { query } = useRouter();

  // if is calling the api
  const { isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>{query.login}</h1>
  
      <img
        src={user.avatar_url}
        alt={user.name}
        width="88"
        style={{ borderRadius: 40 }}
      />

      <h1>{user.name}</h1>
      <h1>{user.bio}</h1>
    </div>

  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Which pages he should generate, which members?

  const response = await fetch(`http://api.github.com/orgs/rocketseat/members`);
  const data = await response.json();

  // params has all the data that will be access in the getStaticProps

  const paths = data.map(member => ({
    params: { login: member.login }
  }))

  return {
    paths,

    // What happens with you try to access a page that does not exists
    // Incremental static generation

    // if fallback is false, will return 404 with not exists
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { login } = context.params;

  const response = await fetch(`http://api.github.com/users/${login}`);
  const data = await response.json();

  return {
    props: {
      user: data,
    },

    // will update every 10 seconds
    revalidate: 10,
  }
}
