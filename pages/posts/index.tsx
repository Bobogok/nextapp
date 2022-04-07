import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import axios from 'axios';
import { BLACK, BLUE, BOX_SHADOW, GREEN } from 'styles/variables';
import Link from 'next/link';

const StyledOl = styled.ol`
  counter-reset: gradient-counter;
  list-style: none;
  margin: 1.75rem 0;
  padding-left: 1rem;
`;

const StyledLi = styled.li.attrs((props: {selected: string}) => props)`
  cursor: pointer;
  background: white;
  border-radius: 0 0.5rem 0.5rem 0.5rem;
  box-shadow: ${BOX_SHADOW};
  counter-increment: gradient-counter;
  margin-top: 1rem;
  min-height: 3rem;
  padding: 1rem 1rem 1rem 3rem;
  position: relative;
  &::before,
  &::after {
    background: linear-gradient(135deg, ${BLUE} 0%,${GREEN} 100%);
    border-radius: 1rem 1rem 0 1rem;
    content: '';
    height: 3rem;
    left: -1rem;
    overflow: hidden;
    position: absolute;
    top: -1rem;
    width: 3rem;
  }
  &::before {
    align-items: flex-end;
    box-shadow: ${BOX_SHADOW};
    content: '${props => props.id}';
    color: ${BLACK};
    display: flex;
    font: 900 1.5em/1 'Montserrat';
    justify-content: flex-end;
    padding: 0.125em 0.25em;
    z-index: 1;
  }
  + li {
    margin-top: 2rem;
  }
`

// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be pre-rendered.
function Home({ posts }: { posts: any }) {
  return (
    <>
      <main>
        <StyledOl>
          {posts.map((post: any) => (
            <Link key={post.id} href={`/posts/${post.id}`} passHref>
              <StyledLi id={post.id}>{post.title}</StyledLi>
            </Link>
          ))}
        </StyledOl>
      </main>
    </>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await axios('http://jsonplaceholder.typicode.com/posts')
  const posts = res.data

  // By returning { props: { posts } }, the Home component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Home
