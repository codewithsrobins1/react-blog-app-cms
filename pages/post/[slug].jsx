//With NextJS Page Routing is like so
// /pages/post === website.com/post
// /pages/post/slug === website.com/post/slug

import React from 'react';
import { getPosts, getPostDetails } from '../../services';
import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm, Loader } from '../../components';
import { useRouter } from 'next/router';

const PostDetails = ({ post }) => {
    const router = useRouter();

    //Show new Articles Even After Deployment
    if(router.isFallback){
        return <Loader />
    }
    return (
        <div className="container mx-auto px-10 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="col-span-1 lg:col-span-8">
                    <PostDetail post={post} />
                    <Author author={post.author} />
                    <CommentsForm slug={post.slug} />
                    <Comments slug={post.slug} />
                </div>
                <div className="col-span-1 lg:col-span-4">
                    <div className="relative lg:sticky top-8">
                        <PostWidget slug={post.slug} categories={post.categories.map((category) => category.slug)} />
                        <Categories />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetails;

//Fetch Data Inside Component using getStaticProps
export async function getStaticProps({ params }) {
    const data = await getPostDetails(params.slug);
    return {
      props: {
        post: data
      }
    }
}

//Determine All Possible Paths App can go to -- Needed for Static Generation
export async function getStaticPaths(){
    const posts = await getPosts();
    return {
        paths: posts.map(({ node: { slug }}) => ({
            params: { slug }
        })),
        fallback: true,
    }
}
