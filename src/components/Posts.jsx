import React, {useEffect, useState} from "react";
import axios from 'axios';
import {Card, Dropdown, Container, FormControl, Button, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import styled from "styled-components";


export default function Posts() {

    const [posts, setPosts] = useState([]);
    const [postTerm, setPostTerm] = useState({
        title: '',
        body: '',
        id: null
    });

    const handleChange = () => {
        setPostTerm(state => ({...state, id: Math.floor(Math.random() * 1000000000) + 1}))
    };


    const addPost = async () => {
        setPostTerm(state => ({...state, id: Math.floor(Math.random() * 100000000) + 1}));
        setPosts(prev => [...prev, postTerm]);
        await axios.post('https://bloggy-api.herokuapp.com/posts',
            postTerm
        )
            .then(response => setPostTerm({
                title: '',
                body: '',
                id: null
            }))
            .catch((e) => {
                console.log(e);
            });
    }


    const deletePost = (id) => {
        const newPosts = posts.filter((item) => item.id !== id);
        setPosts(newPosts);
        axios.delete(`https://bloggy-api.herokuapp.com/posts/${id}`)
            .then(response => console.log(response.data))
            .catch((e) => {
                console.log(e);
            });
    }

    const getPosts = async () => {
        try {
            await axios.get('https://bloggy-api.herokuapp.com/posts')
                .then((response) => {
                    setPosts(response.data);
                })
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getPosts();
        handleChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <Container fluid={"md"}>
            <FormControl
                style={{marginTop: "30px"}}
                className="postTerm"
                size={"lg"}
                value={postTerm.title}
                onChange={({target}) => setPostTerm(state => ({...state, title: target.value}))}
                placeholder="Write Post Title"
                aria-label="Write post"
                aria-describedby="basic-addon2"
            />

            <FormControl
                style={{marginTop: "10px", marginBottom: "10px"}}
                className="DescriptionTerm"
                size={"lg"}
                value={postTerm.body}
                onChange={({target}) => setPostTerm(state =>
                    ({...state, body: target.value}))}
                placeholder="Write Post Description"
                aria-label="Write post"
                aria-describedby="basic-addon2"
            /><Button onClick={() => addPost()} disabled={postTerm.title.length == "" || postTerm.body.length == ""}>
            Add Post</Button>
            <Dropdown.Divider/>

            {posts.map((post, index) => {
                return (<Card key={index} style={{marginTop: "10px"}}>
                        <Card.Body>
                            <Form.Label>Post title:</Form.Label>
                            <Paragraph>{post.title}</Paragraph>
                            <Dropdown.Divider/>
                            <Form.Label>Post description:</Form.Label>
                            <blockquote className="blockquote mb-0">
                                <Paragraph>
                                    {post.body}
                                </Paragraph>
                                <Dropdown.Divider/>
                                <Button variant="danger" onClick={() => deletePost(post.id)}>Delete Post</Button>
                                <Dropdown.Divider/>
                                <Link to={`/details/${post.id}`}>
                                    <Button variant="warning">
                                        Send comments or edit this post
                                    </Button>
                                </Link>
                            </blockquote>
                        </Card.Body>
                    </Card>
                )
            })}
        </Container>
    );
}
const Paragraph = styled.p`
      font-size: 17px;
      font-weight: bold;
    `;
