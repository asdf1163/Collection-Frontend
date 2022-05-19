import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Col, Form } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { postUser } from '../../common/api/userApi'
import { AuthContext, AuthContextType } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'



interface IuserData {
    username: string,
    password: string,
    email: string
}

const Signup = () => {
    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext) as AuthContextType
    const { t } = useTranslation()

    const [requestError, setRequsetError] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<IuserData>()
    const onSubmit: SubmitHandler<IuserData> = async (data) => {
        try {
            const result = await postUser({ data, param: 'signup' })
            setRequsetError("")
            setAuth(result.data)
            navigate('/')
            return result
        }
        catch (error: any) {
            return setRequsetError(error.response.data)
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center">
            <Col className="d-flex flex-column w-25 gap-3 my-5">
                <Form.Group>
                    <Form.Label>
                        {t("authorization.username")}
                    </Form.Label>
                    <Form.Control type="text" autoComplete='current-username' {...register("username", { required: true })} />
                    {errors.username && <span className="text-danger">This field is required</span>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        {t("authorization.password")}
                    </Form.Label>
                    <Form.Control type="password" autoComplete='current-password' {...register("password", { required: true })} />
                    {errors.password && <span className="text-danger">This field is required</span>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        E-mail
                    </Form.Label>
                    <Form.Control type="email" autoComplete='current-email' {...register("email", { required: true })} />
                    {errors.email && <span className="text-danger">This field is required</span>}
                </Form.Group>
                <Button type="submit">
                    {t("authorization.signup")}
                </Button>
            </Col>
            {requestError.length !== 0 && <span>{requestError}</span>}
            <Col>
                {t("authorization.singininfo")}  <Link to="/signin">{t("authorization.signin")}</Link>
            </Col>
        </Form>
    )
}

export default Signup