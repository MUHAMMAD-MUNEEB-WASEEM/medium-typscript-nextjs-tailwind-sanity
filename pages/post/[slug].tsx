import Header from '../../components/Header/Header'
import { Post } from '../../typing.js'
import {sanityClient, urlFor} from '../../sanity'
import PortableText from 'react-portable-text';

interface Props{
    post: Post;
}

function Post({post}: Props) {
    console.log(post)
  return (
    <main>
        <Header/>

        <img 
          className='w-full h-40 object-cover' 
          src={urlFor(post.mainImage).url()}
          alt="post image"/>

        <article className='max-w-3xl mx-auto p-5'>
          <h1 className='text-4xl mt-10 mb-3'>{post.title}</h1>
          <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>

          <div className='flex items-center space-x-2'>
            <img 
              className='h-10 w-10 rounded-full'
               src={urlFor(post.author.image).url()!} 
               alt='author image'
            />
            <p className='font-extralight text-sm'>Blog post by {" "} 
              <span className='text-green-600'>{post.author.name}</span>
            - Published at {new Date(post._createdAt).toLocaleString()}
            </p>
          
          </div>

          <div className='mt-10'>
            <PortableText 
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
              content={post.body}
              serializers={
                {
                  h1: (props: any) => (
                    <h1 className="my-5 text-2xl font-bold" {...props}></h1>
                  ),
                  h2: (props: any) => (
                    <h1 className="my-5 text-xl font-bold" {...props}></h1>
                  ),
                  li: ({ children }: any) => (
                    <li className="ml-4 list-disc">{children}</li>
                  ),
                  link: ({ children, href }: any) => (
                    <a href={href} className="text-blue-500 hover:underline">
                      {children}
                    </a>
                  ),
                }

              }
            />
          </div>
        


        </article>

          
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
    // to make paths 
    // post/my-first-post or post/slug
    //So we need to query slug

    const query = `*[_type == 'post']  {
        _id, 
        slug,
      } 
      `

    const posts = await sanityClient.fetch(query);


    //we can use it as props or path under return

    //we choose name as path ->> /post/slug

     const paths = posts.map((post:Post) => {
        return {
        params: { slug: post.slug.current },
        };
  });

  //slug of all posts has been saved in params
  //curly bracket with return as used as dict to destructure easily

  return {
      paths,
      fallback: 'blocking',
  }
}

//first we create path for post page
//Now we need to get data on that post page to make it pre-build, 
//for that we use get static props
//when to fetch post page
//use getstatic paths with getstaticprops

export const getStaticProps = async (ctx:any) => {

    //ctx : { params: { name: item.name } },

    const slug = ctx.params?.slug;
    
    const query = `*[_type == "post" && slug.current == $slug][0] {
        _id,
        _createdAt,
        title,
        author -> {
          name,
          image
        },
        "comments": *[
          _type == "comment" &&
          post._ref == ^._id && 
          approved == true
        ],
        description,
        mainImage,
        slug,
        body
      }`

      const post = await sanityClient.fetch(query, {
          slug: slug
      });

      if(!post){
          return {
              notFound:true
          }
      }

    return {
        props: { 
            post,
        },
        revalidate: 60, //after 60 seconds, upate old cache
    }


}

//first we select name as path
//we use that path(name) in getStaticProps to fetch single product from data
//as use that single product as props 


