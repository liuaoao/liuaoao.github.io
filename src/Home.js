import { useState, useEffect } from "react";
import BlogList from './BlogList'
import useFetch from "./fetch";

const Home = () => {
    // 初始化数据
    // const [blogs, setBlogs] = useState([
    //     {title: 'My new website', body: 'lorem ipsum...', author: 'mario', id:1},
    //     {title: 'Welcome party!', body: 'lorem ipsum...', author: 'yoshi', id:2},
    //     {title: 'Web dev top tips!', body: 'lorem ipsum...', author: 'mario', id:3}
    // ])

    const { data:blogs, isPenging, error } = useFetch('http://localhost:8000/blogs')

    // const handleDelete = (id) => {
    //     const newBlogs = blogs.filter(blog => blog.id !== id);
    //     setBlogs(newBlogs)
    // }

    const [name, setName] = useState('mario')


    return ( 
        <div className="home">
            { error && <div>{error}</div>}
            { isPenging && <div>Loading...</div>}

            {blogs && <BlogList blogs={blogs} title='All Blogs'/>}
            {/* 过滤好的blog */}
            {/* <BlogList blogs={blogs.filter((blog) => blog.author === "mario")} title="mario's Blogs"/> */}
            {/* <button onClick={() => setName('luigi')}>change name</button> */}
            {/* <p>{ name }</p> */}
        </div>
     );
}
 
export default Home;