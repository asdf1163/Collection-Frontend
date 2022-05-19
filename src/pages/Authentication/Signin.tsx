import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Col } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { postUser } from '../../common/api/userApi'
import { AuthContext, AuthContextType } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'

interface IuserData {
    username: string,
    password: string
}

const Signin = () => {

    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext) as AuthContextType
    const { t } = useTranslation()

    const [requestError, setRequsetError] = useState({ display: false, message: "" })
    const { register, handleSubmit, formState: { errors } } = useForm<IuserData>()
    const onSubmit: SubmitHandler<IuserData> = async (data) => {
        try {
            const result = await postUser({ data, param: 'signin' })
            setAuth(result.data)
            setRequsetError({ display: false, message: "" })
            navigate('/')
        }
        catch (error: any) {
            return setRequsetError({ display: true, message: error.response.data })
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center">
            <Col className="d-flex flex-column w-25 gap-3 my-5">
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>
                        {t("authorization.username")}
                    </Form.Label>
                    <Form.Control type="text" autoComplete='current-username' {...register("username", { required: true })} />
                    {errors.username && <span className="text-danger">This field is required</span>}
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>
                        {t("authorization.password")}
                    </Form.Label>
                    <Form.Control type="password" autoComplete='current-password' {...register("password", { required: true })} />
                    {errors.password && <span className="text-danger">This field is required</span>}
                </Form.Group>
                <Button type="submit">
                    {t("authorization.signin")}
                </Button>
            </Col>
            {requestError.display && <span>{requestError.message}</span>}
            <Col>
                {t("authorization.singupinfo")} <Link to="/signup">{t("authorization.signup")}</Link>
            </Col>
        </Form>
    )
}

export default Signin