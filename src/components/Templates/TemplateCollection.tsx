import React, { useState } from 'react'
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { deleteCollection, postCollection, updateCollection } from '../../common/api/collectionApi'
import { Icollection } from '../../interfaces/collections.interfaces'
import { useTranslation } from 'react-i18next'
import { BsPlusCircle, BsX } from 'react-icons/bs'

interface Props {
    type: 'create' | 'edit'
    dataCollection?: Icollection
    setCollections: React.Dispatch<React.SetStateAction<Icollection[]>>
}

const TemplateCollection = ({ type = 'create', dataCollection, setCollections }: Props) => {

    const [show, setShow] = useState(false)
    const { t } = useTranslation()

    const { control, register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: dataCollection
    })
    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "additional",
    });

    const onSubmit: SubmitHandler<any> = async (formData) => {
        try {
            if (type === 'edit') {
                const { status } = await updateCollection(formData, `edit/${dataCollection?._id}`)
                if (status === 204) {
                    setCollections((collections: any) => {
                        return collections?.map((collection: { _id: Icollection['_id'] }) => {
                            if (collection._id === dataCollection?._id) return formData
                            else return collection
                        })
                    })
                }
            }
            else {
                const { data, status } = await postCollection(formData, 'create')
                if (status === 200) {
                    setCollections((collections: Icollection[]) => [...collections, { ...data }])
                }
            }
            setShow(false)
        }
        catch (error: any) {
            throw new Error(error)
        }
    }

    const handleDelete = async () => {
        try {
            const result = await deleteCollection("", `delete/${dataCollection?._id}`)
            if (result.status === 204) {
                setCollections((collections: Icollection[]) => collections.filter(((collection: Icollection) => collection._id !== dataCollection?._id)))
            }
        } catch (error) {
            throw (error)
        }
    }

    return (
        <>
            <div className={type === 'edit' ? "d-flex gap-4 justify-content-center py-2 border w-100" : "d-flex gap-4 justify-content-center py-2"}>
                <Button className="ms-auto" onClick={() => setShow(true)}>{type === 'edit' ? t('action.edit') : t('action.create')}</Button>
                {type === 'edit' &&
                    <Button variant="danger" onClick={handleDelete}>{t('action.delete')}</Button>
                }
            </div>
            <Modal show={show} size='lg' onHide={() => setShow(false)}>
                <Modal.Header>
                    {type === 'edit' ? <h3>{t('card.modal.titleEditCollection')}: </h3> : <h3>{t('card.modal.titleCreateCollection')}: </h3>}
                </Modal.Header>
                <Container>
                    <Form className="d-flex flex-column gap-2 m-2" onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            <Form.Label>{t('card.modal.name')}</Form.Label>
                            <Form.Control {...register("name", { required: true })} />
                            {errors.name && <span>This field is required</span>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('card.modal.description')}</Form.Label>
                            <Form.Control {...register("description")} />
                            {errors.description && <span>This field is required</span>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('card.modal.topic')}</Form.Label>
                            <Form.Control {...register("topic", { required: true })} />
                            {errors.topic && <span>This field is required</span>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('card.modal.additional')}</Form.Label>
                            <Col className="d-flex flex-column gap-2">
                                {fields.map((field: any, index: number) =>
                                    <Row key={field.id}>
                                        <Col>
                                            <Form.Control key={field.id} {...register(`additional.${index}.name`)} />
                                        </Col>
                                        <Col>
                                            <Form.Select key={field.id} {...register(`additional.${index}.value`)}>
                                                <option>number</option>
                                                <option>text</option>
                                                <option>boolean</option>
                                                <option>date</option>
                                                <option>textarea</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs="2">
                                            <BsX onClick={() => remove(index)} size={30} color={'red'} />
                                        </Col>
                                    </Row>
                                )}
                            </Col>

                            <Row className="p-2">
                                <Col className="d-flex justify-content-center p-2">
                                    <BsPlusCircle size={30} color={'#888'} onClick={() => { append({ name: "", value: "number" }) }} />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('card.modal.image')}</Form.Label>
                            <Form.Control type="text" {...register("linkImg", { pattern: /^(http|https):/ })} />
                            {errors.linkImg && "Give URL to the image"}
                        </Form.Group>
                        <Form.Group className="my-3">
                            <Button type='submit'> {t('action.submit')} </Button>
                        </Form.Group>
                    </Form>
                </Container>
            </Modal>
        </>
    )
}

export default TemplateCollection