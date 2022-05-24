import { useState, useContext, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Col, Dropdown, Form, Nav, Row, Stack } from 'react-bootstrap'
import { AuthContext, AuthContextType } from '../context/AuthContext'
import { BsPersonCircle } from "react-icons/bs";
import { useTranslation } from 'react-i18next'
import SwitchLanguage from './Navbar/SwitchLanguage'
import ThemeWrapper from './Navbar/ThemeWrapper'
import { getUser } from '../common/api/userApi';
import { useForm } from 'react-hook-form';
import { getItem } from '../common/api/itemApi';
import { Iitem } from '../interfaces/collections.interfaces';

const Navbar = () => {
    const { auth } = useContext(AuthContext) as AuthContextType
    const { t } = useTranslation()

    const handleLogout = async () => {
        try {
            const result = await getUser('logout')
            if (result.status === 200) {
                return window.location.reload()
            }
        } catch (error) {
            throw error
        }
    }
    return (
        <Nav className="navbar bg-warning px-2">
            <Row>
                <Link to={"/"}>Logo</Link>
            </Row>
            <Row>
                <SearchBar />
            </Row>
            <Row className='ms auto g-0 gap-3 align-items-center'>
                <Col>
                    <SwitchLanguage />
                </Col>
                <Col>
                    <ThemeWrapper />
                </Col>
                {auth._id
                    ? (
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant={'warning'}>
                                    <BsPersonCircle size={30} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Header><h4>{auth.username}</h4></Dropdown.Header>
                                    <Dropdown.Item as={Link} to={`/${auth.username}`}>{t('navbar.profile.profile')}</Dropdown.Item>
                                    {(auth.privilage === 'admin' || auth.privilage === "owner") && <Dropdown.Item as={Link} to={'/_admin'}>{t('navbar.profile.adminpanel')}</Dropdown.Item>}
                                    <Dropdown.Item onClick={handleLogout}>{t('navbar.profile.logout')}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    )
                    :
                    <Col className="px-3">
                        <Link to="/signin" className="text-nowrap">{t('authorization.signin')}</Link>
                    </Col>}
            </Row>
        </Nav>
    )
}

interface ISearchBarProps { display: boolean, result: Partial<Iitem[]> }

const SearchBar = () => {
    const { t } = useTranslation()
    const { register, handleSubmit } = useForm()
    const [dropdown, setDropdown] = useState<ISearchBarProps>({
        display: false,
        result: []
    })

    const hideDropdown = () => setDropdown((prev: ISearchBarProps) => ({ ...prev, 'display': false }))

    function debounce(callback: any) {
        let timeout: ReturnType<typeof setTimeout>;
        return (...args: any) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                callback(...args)
            }, 800)
        }
    }

    const searchChange: any = async (data: { searchBar: string }) => {
        if (data.searchBar.length !== 0) {
            try {
                const searchResult = await getItem(`/search?q=${data.searchBar}`)
                if (searchResult.data.length !== 0) {
                    return setDropdown({ display: true, result: searchResult.data })
                }
                else
                    return setDropdown({ display: true, result: [] })
            }
            catch (error) {
                throw (error)
            }
        }
        else hideDropdown()
    }

    const handleBlur = useCallback((e: any) => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => {
            if (!currentTarget.contains(document.activeElement))
                hideDropdown()
        })
    }, [])

    return (
        <Stack direction="vertical" gap={2} className="d-none d-lg-flex">
            <Form onBlur={(e) => handleBlur(e)}>
                <Form.Control className="me-auto" placeholder={t("navbar.placeholder")} style={{ width: '350px' }} autoComplete='off' {...register('searchBar', {
                    onChange: debounce(handleSubmit(searchChange)),
                })} />
                <Dropdown show={dropdown.display}>
                    <Dropdown.Menu className="w-100">
                        {dropdown.result?.length ?
                            dropdown.result?.map((item: Partial<Iitem> | undefined) =>
                                <Dropdown.Item key={item?._id} as={Link} to={`/admin/item/${item?._id}`} onClick={hideDropdown}>{item?.name}</Dropdown.Item>
                            ) : <Dropdown.Item disabled>{t('action.notfound')}</Dropdown.Item>}
                    </Dropdown.Menu>
                </Dropdown>
            </Form>
        </Stack >
    )
}

export default Navbar