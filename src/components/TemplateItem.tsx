import { useState } from 'react'
import { Form, Button, Modal, Container } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { deleteItem, postItem, updateItem } from '../common/api/itemApi'
import { Icollection, Iitem } from '../interfaces/collections.interfaces'
import { useTranslation } from 'react-i18next'

interface Props {
    type: 'create' | 'edit'
    dataItem?: Iitem
    dataCollection?: Icollection
    collectionAuthorId?: string
    setCollection: React.Dispatch<React.SetStateAction<Icollection>>
}

const TemplateItem = ({ type = 'create', dataItem, dataCollection, collectionAuthorId = "", setCollection }: Props) => {
    const [show, setShow] = useState(false)
    const { t } = useTranslation()

    const { register, control, handleSubmit, formState: { errors } } = useForm<Iitem>({
        defaultValues: {
            name: dataItem?.name,
            tags: dataItem?.tags,
            linkImg: dataItem?.linkImg,
            additional: dataItem?.additional
        }
    })

    const onSubmit: SubmitHandler<Iitem> = async (data) => {
        try {
            Object.assign(data, { collectionId: dataCollection?._id }, { ownerId: dataCollection?.idUser });
            if (type === 'edit') {
                const result = await updateItem(data, `${type}/${dataItem?._id}`)
                if (result.status === 204) {
                    setCollection((prev: Icollection) =>
                    ({
                        ...prev,
                        items: prev?.items?.map((elem: Iitem) => elem._id === dataItem?._id ? data : elem)
                    }))
                }
            }
            else {
                const result = await postItem(data, type)
                if (result.status === 200) {
                    setCollection((prev: any) => ({ ...prev, [prev.items]: { ...prev['items'].push(result['data']) } }))
                }
            }
            return setShow(false)
        }
        catch (error: any) {
            throw new Error(error)
        }
    }

    const handleDelete = async () => {
        try {
            const result = await deleteItem({ collectionAuthorId }, `delete/${dataItem?._id}`)
            if (result.status === 204)
                return setCollection((prev: Icollection) => ({ ...prev, items: prev?.items?.filter(((item: { _id: string }) => item._id !== dataItem?._id)) }))
        } catch (error) {
            throw error
        }
    }

    return (
        <>
            <Button onClick={() => setShow(true)}>{type === 'edit' ? t('card.options.edit') : t('card.options.create')}</Button>
            {type === "edit" &&
                <Button variant="danger" onClick={handleDelete}>{t('card.options.delete')}</Button>
            }
            <Modal show={show} size='lg' onHide={() => setShow(false)}>
                <Modal.Header>
                    {type === 'create' ? <h3>{t('card.modal.titleCreateItem')}: </h3> : <h3>{t('card.modal.titleEditItem')}: </h3>}
                </Modal.Header>
                <Container>
                    <Form className="d-flex flex-column gap-2 m-2" onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            <Form.Label>{t('card.modal.name')}</Form.Label>
                            <Form.Control defaultValue={(type === 'edit') ? dataItem?.name : ""} {...register("name", { required: true })} />
                            {errors.name && <span>This field is required</span>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('card.modal.tags')}</Form.Label>
                            <Form.Control defaultValue={(type === 'edit' && dataItem?.tags) ? dataItem?.tags : ""} {...register("tags", { required: true })} />
                            {errors.tags && <span>This field is required</span>}
                        </Form.Group>
                        <Form.Group>
                            {dataCollection?.additional?.length && dataCollection?.additional?.map(((collectionField: Iitem['additional'], index: number) => {
                                return (
                                    <Form.Group key={collectionField?._id}>
                                        <Form.Label>{collectionField.name}</Form.Label>
                                        <InputType control={control} register={register} index={index} fieldName={collectionField.name} fieldType={collectionField.value} />
                                    </Form.Group>
                                )
                            }))}
                            <Form.Label>{t('card.modal.image')}</Form.Label>
                            <Form.Control defaultValue={(type === 'edit' && dataItem?.linkImg) ? dataItem?.linkImg : ""} {...register("linkImg")} />
                        </Form.Group>
                        <Form.Group className="my-3">
                            <Button type='submit'> {t('card.options.submit')} </Button>
                        </Form.Group>
                    </Form>
                </Container>
            </Modal>
        </>
    )
}

interface IinputTypeProps {
    control: any,
    fieldType: 'number' | 'text' | 'date' | 'boolean' | 'textarea',
    fieldName: string,
    register: any,
    index: number
}

const InputType = ({ fieldType, fieldName, register, index }: IinputTypeProps): JSX.Element => {

    switch (fieldType) {
        case 'number':
        case 'text':
        case 'date': {
            return <Form.Control
                type={fieldType}
                {...register(`additional[${index}].${fieldName}`, { required: true })}
            />
        }
        case 'boolean': {
            return <Form.Check
                type="switch"
                id="custom-switch"
                style={{ height: '50px' }}
                {...register(`additional[${index}].${fieldName}`)}

            />
        }
        case 'textarea': {
            return <Form.Control
                as="textarea"
                style={{ height: '100px' }}
                {...register(`additional[${index}].${fieldName}`, { required: true })}
            />
        }
        default: {
            return <h2>Type not found</h2>
        }
    }
}

export default TemplateItem