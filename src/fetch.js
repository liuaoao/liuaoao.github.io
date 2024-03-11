import { useState, useEffect } from "react";

// custom hooks
const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPenging, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        // 每次render都会触发运行.
        // console.log('use effect ran')
        // console.log(name)
        // 添加依赖, 当status change时都会运行
        // name是依赖项,所以name change时,会运行这个function

        setTimeout(() => {
            // fetch('http://localhost:8000/blogs')
            fetch(url)
                .then(res => {
                    console.log(res);
                    if(!res.ok) {
                        throw Error('could not fetch the data for the resource.');
                    }
                    return res.json();
                })
                .then(data => {
                    // console.log(data);
                    setData(data);
                    setIsPending(false);
                    setError(null);
                })
                .catch((err) => {
                    setError(err.message);
                    setIsPending(false);
                })
        // 模拟等待一分钟
        }, 1000)
    }, []);

    return { data, isPenging, error }
}

export default useFetch;