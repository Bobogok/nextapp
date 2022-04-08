import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Spinner from "styles/Spinner"

function Post({ post: serverPost }: { post: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      url !== router.pathname ? setLoading(true) : setLoading(false);
    };
    const handleComplete = (url: string) => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router]);

  return ( 
    <>
      {loading && <Spinner />}
      <Link href={`${serverPost.id + 1}`}>
        <a>Сдующий пост</a>
      </Link>
      <hr />
      <div />
      {JSON.stringify(serverPost)}
    </>
  )

}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await axios('http://localhost:3001/posts')
  const posts = res.data

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post: any) => ({
    params: { id: post.id.toString() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params, req }: { params: any, req: any }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await axios(`http://localhost:3001/posts/${params.id}`)
  const post  = res.data

  // Pass post data to the page via props
  return { props: { post } }
}

export default Post