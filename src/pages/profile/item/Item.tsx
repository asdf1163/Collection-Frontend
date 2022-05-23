import { useCallback, useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getItem, postItem } from '../../../common/api/itemApi'
import { useTranslation } from 'react-i18next'
import { Iitem } from '../../../interfaces/collections.interfaces'
import { AuthContext, AuthContextType } from '../../../context/AuthContext'
import { SubmitHandler, useForm } from 'react-hook-form'


interface Icomment {
    users: {
        _id: string,
        username: string
    },
    comments: {
        userId: string,
        message: string,
    }
}

interface ICommentForm {
    setComments: React.Dispatch<React.SetStateAction<{ users: Icomment['users'][], comments: Icomment['comments'][] }>>
    itemId?: string
    auth: { _id: string, username: string }
}

const Item = () => {
    const { t } = useTranslation()
    const { username, itemId } = useParams()
    const navigate = useNavigate()
    const [item, setItem] = useState<any>(null)
    const [isLiked, setLike] = useState(false)
    const [comments, setComments] = useState<{ users: Icomment['users'][], comments: Icomment['comments'][] }>({
        users: [{
            _id: '',
            username: ''
        }],
        comments: [{
            userId: '',
            message: '',
        }]
    })

    const { auth } = useContext(AuthContext) as AuthContextType

    const chandleLike = useCallback(async () => {
        try {
            const resultItem = await getItem(`like/${itemId}`);
            if (resultItem.status === 200) {
                setLike(prev => !prev);
            }
        } catch (error) {
            throw (error)
        }
        return;
    }, [itemId])

    const getItemData = useCallback(async () => {
        const { data } = await getItem(`find/${itemId}`)
        setItem(data.item[0])
        if (data.item[0].owner.username !== username) {
            return navigate(`/${data.item[0].owner.username}/item/${itemId}`, { replace: true })
        }
        setLike(data.like)
        setComments(data.comments[0])
    }, [itemId, navigate, username])

    useEffect(() => {
        getItemData()
    }, [getItemData])

    return item && (!item.length
        ? (
            <Container className="">
                <Row className='gx-0 py-4'>
                    <Col lg={7} className="order-sm-0 order-lg-0 d-flex justify-content-center align-items-center">
                        <img
                            className='img-thumbnail w-75'
                            src={item.linkImg}
                            alt='itemImage'
                        />
                    </Col>
                    <Row className="my-5 py-5 justify-content-center order-lg-2 mx-0">
                        <Button
                            variant={isLiked ? "secondary" : "primary"}
                            onClick={chandleLike}
                            disabled={!auth._id}
                        >
                            {isLiked ? t('item.dislike') : t('item.like')}
                        </Button>
                    </Row>
                    <Col className='gx-0 order-lg-1'>
                        <h1 className='gx-0'>{item.name}</h1>
                        {item.description}
                        <hr />
                        <h5>{t('item.tags')}</h5>
                        <span className="d-flex flex-wrap text-center gap-2">
                            {item.tags.map((tag: string) => <div className="bg-secondary px-3 py-2">{tag}</div>)}
                        </span>
                        {item.additional.map((additionalItem: Iitem) =>
                            <span key={Object.keys(additionalItem)[0]}>
                                <hr />
                                <h5>{Object.keys(additionalItem)[0]}</h5>
                                {typeof (Object.values(additionalItem)[0]) === 'boolean'
                                    ? (Object.values(additionalItem)[0] ? '✅' : '❌')
                                    : Object.values(additionalItem)[0]}
                            </span>
                        )}
                    </Col>
                </Row>
                <Row className="mt-5 gx-0">
                    <Col className='gx-0'>
                        <h3>{t('item.comments')}</h3>

                        {auth._id ?
                            <CommentForm setComments={setComments} itemId={itemId} auth={{ _id: auth._id, username: auth.username }} />
                            : <h4>{t('item.textmessage.authtocomment')}</h4>}
                        {comments.comments.length ? comments.comments.map((comment: any) => {
                            const [{ username }] = comments.users.filter((elem: any) => elem._id.includes(comment.userId))
                            return (username && comment.message) ? <CommentModel key={comment._id} comment={comment.message} username={username} /> : ""
                        }) : <h2>{t('item.textmessage.nocomments')}</h2>}

                    </Col>
                </Row>
            </Container>
        )
        : <div>{t('item.textmessage.notfound')}</div>
    )
}

const CommentForm = ({ setComments, itemId, auth }: ICommentForm) => {
    const { register, handleSubmit, resetField } = useForm()
    const { t } = useTranslation()
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const result = await postItem(data, `comment/${itemId}`)
            resetField('message')
            if (result.status === 200) {
                setComments((prev: { users: Icomment['users'][], comments: Icomment['comments'][] }) => {
                    return ({
                        ...prev,
                        comments: [...prev.comments, ({
                            userId: auth._id,
                            message: data.message
                        })],
                        users: [...prev.users, ({
                            _id: auth._id,
                            username: auth.username
                        })]
                    })
                })
            }
        } catch (error) {
            throw (error)
        }
    }

    return <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Control
            as="textarea"
            style={{ height: '100px' }}
            {...register('message', { required: true })}
        />
        <Button type='submit' className="my-2">{t('card.options.submit')}</Button>
    </Form>
}

const CommentModel = ({ comment, username }: { comment: string, username: string }) => {
    return (
        <Row className="py-2">
            <hr />
            <h5>{username}</h5>
            <p>{comment}</p>
        </Row>
    )
}

export default Item