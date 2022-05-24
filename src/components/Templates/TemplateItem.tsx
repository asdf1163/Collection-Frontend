import { useState } from 'react'
import { Form, Button, Modal, Container } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { deleteItem, postItem, updateItem } from '../../common/api/itemApi'
import { Icollection, Iitem } from '../../interfaces/collections.interfaces'
import { useTranslation } from 'react-i18next'

interface Props {
    type: 'create' | 'edit'
    dataItem?: Iitem
    dataCollection?: Icollection
    collectionAuthorId?: string
    setCollection: React.Dispatch<React.SetStateAction<Icollection>>
    setItems: React.Dispatch<React.SetStateAction<Iitem[]>>
}

const TemplateItem = ({ type = 'create', dataItem, dataCollection, collectionAuthorId = "", setCollection, setItems }: Props) => {
    const [show, setShow] = useState(false)
    const { t } = useTranslation()

    const { register, control, handleSubmit, formState: { errors } } = useForm<Iitem>({
        defaultValues: {
            name: dataItem?.name,
            tags: dataItem ? (dataItem?.tags as string[]).join(",") : "",
            linkImg: dataItem?.linkImg,
            additional: dataItem?.additional
        }
    })

    const onSubmit: SubmitHandler<Iitem> = async (data) => {
        try {
            data.tags = (data.tags as string).split(",").map((tag: string) => tag.trim()).filter(tag => tag)
            Object.assign(data, { collectionId: dataCollection?._id });
            if (type === 'edit') {
                const result = await updateItem(data, `${type}/${dataItem?._id}`)
                if (result.status === 204) {
                    Object.assign(data, { _id: dataItem?._id })
                    setItems((item: Iitem[]) => item?.map((elem: Iitem) => elem._id === dataItem?._id ? data : elem))
                }
            }
            else {
                const result = await postItem(data, type)
                if (result.status === 200) {
                    setItems((item: Iitem[]) => [...item, result.data])
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
                return setItems((items: any) => items.filter(((item: Iitem) => item._id !== dataItem?._id)))
        } catch (error) {
            throw error
        }
    }

    return (
        <>
            <div className={type === 'edit' ? "d-flex gap-4 justify-content-center py-2 border" : "d-flex gap-4 justify-content-center py-2"}>
                <Button onClick={() => setShow(true)}>{type === 'edit' ? t('action.edit') : t('action.create')}</Button>
                {type === "edit" &&
                    <Button variant="danger" onClick={handleDelete}>{t('action.delete')}</Button>
                }
            </div>
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
                            {dataCollection?.additional?.length
                                ? (dataCollection?.additional?.map(((collectionField: Iitem['additional'], index: number) =>
                                    <Form.Group key={collectionField.name}>
                                        <Form.Label>{collectionField.name}</Form.Label>
                                        <InputType control={control} register={register} index={index} fieldName={collectionField.name} fieldType={collectionField.value} />
                                    </Form.Group>)))
                                : ""}
                            <Form.Label>{t('card.modal.image')}</Form.Label>
                            <Form.Control defaultValue={(type === 'edit' && dataItem?.linkImg) ? dataItem?.linkImg : ""} {...register("linkImg", { pattern: /^(http|https):/ })} />
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