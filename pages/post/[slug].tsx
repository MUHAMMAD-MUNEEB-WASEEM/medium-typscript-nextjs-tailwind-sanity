import Header from '../../components/Header/Header'
import { Post } from '../../typing.js'
import {sanityClient, urlFor} from '../../sanity'
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

interface Props{
    post: Post;
}

interface IFormInput {
  _id:string;
  name:string;
  email:string;
  comment:string;
}

function Post({post}: Props) {
    console.log(post)

    const { register, handleSubmit, formState: { errors }, } = useForm<IFormInput>();
  
    const [submitted, setSubmitted] = useState(false)

    const onSubmit:SubmitHandler<IFormInput> = async (data) => {
      await fetch('/api/createComment', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      .then(()=> {
        console.log(data)
        setSubmitted(true)
      }) 
      .catch (error=> {
        console.log(error)
        setSubmitted(false)
      })
    }
  
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

          <hr className='max-w-lg my-5 mx-auto border border-yellow-500'/>

         
          {submitted ? (

          <div className="my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
            <h3 className='text-3xl font-bold'>Thankyou for submitting your comment</h3>
            <p>Once it has been approved, it will appear below! </p>
          </div>

          ): (

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 my-10 max-w-2xl mx-auto mb-10'>

            <h3 className="text-sm text-yellow-500">Enjoy this article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>
            <hr className="mt-2 py-3" />

            <input
              {...register('_id')}
              type="hidden"
              name="_id"
              value={post._id}
            />

            <label className="commentLabel">
              <span className='commmentSpan'>Name</span>
              <input {...register('name', { required: true })} className='commentInput form-input' placeholder='John Appeseed' type='text'/>
            </label>
            <label className='commentLabel'>
              <span className='commmentSpan'>Email</span>
              <input {...register('email', { required: true })} className='commentInput form-input' placeholder='john@gmail.com' type='email'/>
            </label>
            <label className='commentLabel'>
              <span className='commmentSpan'>Comment</span>
              <textarea {...register('comment', { required: true })} className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='I Like it!' rows={8}/>
            </label>

            {/*errors when validation failed*/}

            <div className="flex flex-col">
              {errors.name && (
                <span className="text-red-500">
                  - The Name Field is required
                </span>
              )}
              {errors.comment && (
                <span className="text-red-500">
                  - The Comment Field is required
                </span>
              )}
              {errors.email && (
                <span className="text-red-500">
                  - The Email Field is required
                </span>
              )}
            </div>

            <input type='submit' className='shadow bg-yellow-500
             hover:bg-yellow-400 focus:shadow-outline 
             focus:outline-none text-white font-bold py-2 
             px-4 rounded cursor-pointer'/>

          </form>
        

          )}

          {/*comments*/}

          <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow  shadow-yellow-500">
            <h3 className="text-4xl">Comments</h3>
            <hr className="pb-2" />

            {post.comments.map((comment) =>(
                <div key={comment._id}>
                  <p>
                    <span className="text-yellow-500">{comment.name}: </span>
                    {comment.comment}
                  </p>
                </div>
              ))}
        </div>
         

          
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


