import { Avatar, Button, Card, Col, Divider, Pagination, Row, Space, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import commentApi from '../../api/commentAPI';
import { currentUser } from '../../redux/selectors';
import SnackBarAlert from '../SnackBarAlert';
import { HeartOutlined, LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import './index.css';
import moment from 'moment';
const { Meta } = Card;

const CommentsProduct = (props) => {

    const navigate = useNavigate()
    const _currentUser = useSelector(currentUser)
    const [comments, setComments] = useState([])
    console.log("🚀 ~ file: CommentsProduct.jsx:15 ~ CommentsProduct ~ comments:", comments)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [newCommentBody, setNewCommentBody] = useState(null)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [messageError, setMessageError] = useState("No Error")
    const [messageSuccess, setMessageSuccess] = useState("Notification")

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);
    };


    const HandlePostNewComment = async () => {

        if (newCommentBody == null) {
            setMessageError("Comment is not allowed empty! :((")
            setOpenErrorAlert(true)
            handleClose()
        }
        else if (localStorage.getItem('idUser') == "") {
            setMessageError("Please login before comment!")
            setOpenErrorAlert(true)
            handleClose()
            navigate('/login')
        }
        else {
            const newComment = {
                "userID": localStorage.getItem('idUser'),
                "productID": props.productID,
                "body": newCommentBody,
                "postDate": Date.now().toString()
            }
            const response = await commentApi.postNewComment(newComment)
            console.log("🚀 ~ file: CommentsProduct.jsx:56 ~ HandlePostNewComment ~ response:", response)
            if (response.status === 200) {
                const updatedComments = [response.data, ...comments];
                setComments(response.data.reverse())
                setMessageSuccess("Bình luận thành công")
                setOpenSuccessAlert(true)
                handleClose()
                setNewCommentBody('')
            }
            else {
                setMessageError("Bình luận thất bại! :((")
                setOpenErrorAlert(true)
                handleClose()
            }
        }
    }

    useEffect(() => {
        let cancel = false;

        const fetchData = async () => {
            try {
                const response = await commentApi.getCommentsWithID(props.productID);
                if (!cancel && response.status === 200) {
                    setComments(response.data.reverse());
                    setLoading(false);
                } else {
                    console.log("Load comment failed");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error loading comments:", error);
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            cancel = true;
        };
    }, [])

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = comments.slice(startIndex, endIndex);
    return (
        <>
            <Row>
                <Col span={20}>
                    <TextArea
                        value={newCommentBody}
                        rows={4}
                        placeholder="Nhập nội dung bình luận..."
                        style={{
                            width: '100%'
                        }}
                        onChange={(e) => setNewCommentBody(e.target.value)}
                    />
                    <Button
                        type="primary"
                        block
                        size="large"
                        style={{
                            // display: 'flex',
                            // justifyContent: 'flex-end',
                            // width: '100px',
                            height: "56px",
                            backgroundColor: "#ce0707 !important",
                            borderColor: "#ce0707",
                        }}
                        className="custom-button"
                        onClick={HandlePostNewComment}
                    >
                        GỬI BÌNH LUẬN
                    </Button>
                </Col>
                <Col span={4}>

                </Col>
                <Divider />

            </Row>
            <Row>
                <Col span={20}>
                    {
                        currentData?.map((comment, index) => {
                            const formattedDate = moment(Number(comment.postDate)).format('YYYY-MM-DD HH:mm:ss');
                            return (
                                <Card
                                    key={index}
                                    style={{
                                        width: '100%',
                                    }}
                                    className='card-comment'
                                    actions={[
                                        <Tooltip title="Like">
                                            <Button icon={<LikeOutlined key='like' />} />
                                        </Tooltip>,
                                        <Tooltip title="Heart">
                                            <Button icon={<HeartOutlined key='love' />} />
                                        </Tooltip>,
                                        <Tooltip title="Share">
                                            <Button icon={<ShareAltOutlined key='share' />} />
                                        </Tooltip>,
                                    ]}
                                >
                                    <Meta
                                        avatar={<Avatar src={comment?.account?.avatar} />}
                                        title={comment?.account?.name}
                                        description={comment?.body}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        marginLeft: '48px',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        gap: '10px'
                                    }}>
                                        <p
                                            style={{
                                                // margin: '10px 0 0 48px'
                                            }}
                                        >{formattedDate}</p>
                                        <Tooltip title="Like">
                                            <Button icon={<LikeOutlined key='like' />} />
                                        </Tooltip>
                                        <Tooltip title="Heart">
                                            <Button icon={<HeartOutlined key='love' />} />
                                        </Tooltip>
                                        <Tooltip title="Share">
                                            <Button icon={<ShareAltOutlined key='share' />} />
                                        </Tooltip>
                                    </div>
                                </Card>
                            )
                        })
                    }
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={comments.length}
                        onChange={handlePageChange}
                    />
                </Col>
                <Col span={4}>
                </Col>
            </Row>
            <SnackBarAlert severity='success' open={openSuccessAlert} handleClose={handleCloseAlert} message={messageSuccess} />
            <SnackBarAlert severity='error' open={openErrorAlert} handleClose={handleCloseAlert} message={messageError} />
        </>
    )
}

export default CommentsProduct