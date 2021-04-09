import React, {useState, useEffect} from "react";
import axios from "axios";
import {Card, Modal, Dropdown, Form, Container, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from "styled-components";
import {Link} from "react-router-dom";

export default function PostDetails({match}) {
    const [details, setDetails] = useState([]);
    const [comments, setComments] = useState({body: '', postId: details.id});
    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState({
        title: '',
        body: '',
        id: details.id
    });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const onSave = () => {
        setDetails(edited);
        handleClose();
        axios.put(`https://bloggy-api.herokuapp.com/posts/${match.params.id}`, edited)
            .then(response => console.log(response.data))
            .catch((e) => {
                console.log(e);
            });
    }


    const getComments = async () => {
        try {
            await axios.get(`https://bloggy-api.herokuapp.com/comments`)
                .then((response) => {
                    setComments(response.data);
                })
        } catch (e) {
            console.log(e);
        }
    };

    const getPostDetails = async () => {
        try {
            await axios.get(`https://bloggy-api.herokuapp.com/posts/${match.params.id}`)
                .then((response) => {
                    setDetails(response.data);
                })
        } catch (e) {
            console.log(e);
        }
    };

    const onPostComments = async () => {
        try {
            await axios.post(`https://bloggy-api.herokuapp.com/comments/${match.params.id}`, comments)
                .then((response) => {
                    setComments({body: '', postId: details.id})
                    alert("COMMENT IS ALREADY POSTED, PLEASE CHECK HEROKUAPP!")
                })
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getComments();
        getPostDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (<Container fluid={"md"}>
        <Card key={details.id}>
            <Card.Header>POST DETAILS</Card.Header>
            <Card.Body>
                <Form.Label>Post title:</Form.Label>
                <Paragraph>{details.title}</Paragraph>
                <Dropdown.Divider/>
                <Form.Label>Post description:</Form.Label>
                <blockquote className="blockquote mb-0">
                    <Paragraph>
                        {details.body}
                    </Paragraph>
                    <Dropdown.Divider/>
                    <Button variant="warning" onClick={handleShow}>Edit</Button>
                    <Dropdown.Divider/>
                    <Link to={'/'}>
                        <Button variant="success">
                            Return to posts
                        </Button>
                    </Link>
                </blockquote>
            </Card.Body>
        </Card>
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Edit post title here!</Form.Label>
                <Form.Control type="text" defaultValue={details.title}
                              onChange={({target}) => setEdited(state => ({
                                  ...state,
                                  title: target.value,
                                  id: details.id
                              }))}/>
            </Form.Group>
            <Modal.Body>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Edit post description here!</Form.Label>
                    <Form.Control as="textarea" rows={3} type="text" defaultValue={details.body}
                                  onChange={({target}) => setEdited(state => ({
                                      ...state,
                                      body: target.value,
                                      id: details.id
                                  }))}/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onSave}
                        disabled={edited.body.length == "" || edited.title.length == ""}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
        <Dropdown.Divider/>
        <Form>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Write a comment here!</Form.Label>
                <Form.Control type="text" placeholder="Comment"
                              onChange={({target}) => setComments(state => ({
                                  ...state,
                                  body: target.value,
                                  id: details.id
                              }))}/>
            </Form.Group>
            <Button variant="primary" disabled={comments.body == ""} onClick={onPostComments} type="submit">
                Post Comment
            </Button>
        </Form>

    </Container>);
}
const Paragraph = styled.p`
      font-size: 17px;
      font-weight: bold;
    `;

