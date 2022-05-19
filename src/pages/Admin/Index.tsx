import { useState, useEffect, useContext } from 'react'
import { Table, Stack, Dropdown, Button } from 'react-bootstrap'
import { deleteUser, getUser, updateUser } from '../../common/api/userApi'
import {ThemeContext, ThemeContextType} from '../../context/ThemeContext'
import { IuserSchema } from '../../interfaces/users.interfaces'

const Index = () => {
  const [users, setUsers] = useState<IuserSchema[]>([])
  const { theme } = useContext(ThemeContext) as ThemeContextType;

  const getUserApi = async () => {
    try {
      const result = await getUser('users')
      setUsers(result.data)
    } catch (error) {
      throw(error)
    }
  }

  const changePrivilage = async (userId: string, privilage: IuserSchema['privilage']) => {
    try {
      const result = await updateUser({ data: { privilage }, param: `update/${userId}` })
    } catch (error) {
      throw new Error("Somthing went wrong during changing user's privilage")
    }
  }

  const changeStatus = async (userId: string, status: IuserSchema['status']) => {
    try {
      const result = await updateUser({ data: { status }, param: `update/${userId}` })
    } catch (error) {
      throw new Error("Somthing went wrong during changing user's status")
    }
  }

  const deleteUserFromDatabase = async (userId: string) => {
    try {
      const result = await deleteUser({ param: `delete/${userId}` })
    } catch (error) {
      throw new Error("Somthing went wrong during deleting user")
    }
  }

  useEffect(() => {
    getUserApi()
  }, [])


  return (
    <>
      <Stack direction="horizontal" gap={3} className="p-2">
        <span>filter</span>
        <input type="text" />
        <Button className="ms-auto">Export</Button>
      </Stack>
      <Table className={`text-${theme.fontColor}`} striped hover responsive>
        <thead>
          <tr>
            <th> ID </th>
            <th> username </th>
            <th> email </th>
            <th> privilage </th>
            <th> status </th>
            <th> options </th>
          </tr>
        </thead>
        <tbody>
          {users.length !== 0 && users.map((user: IuserSchema) =>
            <tr key={user._id}>
              <td className={`text-${theme.fontColor}`}> {user._id} </td>
              <td className={`text-${theme.fontColor}`}> {user.username} </td>
              <td className={`text-${theme.fontColor}`}> {user.email} </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle disabled={user.privilage === 'owner'}>{user.privilage}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => changePrivilage(user._id, "admin")}>Admin</Dropdown.Item>
                    <Dropdown.Item onClick={() => changePrivilage(user._id, "user")}>User</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle disabled={user.privilage === 'owner'}>{user.status}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => changeStatus(user._id, 'blocked')}>block</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeStatus(user._id, 'unlocked')}>unlock</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td><Button onClick={() => deleteUserFromDatabase(user._id)} variant='danger' disabled={user.privilage === 'owner'}> DELETE</Button></td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

export default Index