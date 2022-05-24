import { useState, useEffect, useContext } from 'react'
import { Table, Stack, Dropdown, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { deleteUser, getUser, updateUser } from '../../common/api/userApi'
import Fusion from '../../components/Filter/Fusion'
import { ThemeContext, ThemeContextType } from '../../context/ThemeContext'
import { IuserSchema } from '../../interfaces/users.interfaces'

interface IdataUpdate {
  privilage: IuserSchema['privilage']
  status: IuserSchema['status']
}

const Index = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState<IuserSchema[]>([])
  const [pending, setPending] = useState(false)
  const { theme } = useContext(ThemeContext) as ThemeContextType;

  const getUserApi = async () => {
    setPending(true)
    try {
      const { data, status } = await getUser('users')
      if (status === 200) {
        setUsers(data)
      }
    } catch (error) {
      throw error
    }
    setPending(false)
  }

  const changeUserData = async (userId: string, data: Partial<IdataUpdate>) => {
    try {
      const { status } = await updateUser({ data, param: `update/${userId}` })
      if (status === 200) {
        const objName: string = Object.keys(data)[0]
        const objValue: string = Object.values(data)[0]
        return setUsers((prev: any) => prev.map((user: any) => ({ ...user, [objName]: user._id === userId ? objValue : user[objName] })));
      }
    } catch (error) {
      throw new Error("Somthing went wrong during changing user's data")
    }
  }

  const deleteUserFromDatabase = async (userId: string) => {
    try {
      const { status } = await deleteUser({ param: `delete/${userId}` })
      if (status === 200)
        return setUsers((prev: any) => prev.filter((user: any) => user._id !== userId));
    } catch (error) {
      throw new Error("Somthing went wrong during deleting user")
    }
  }

  useEffect(() => {
    getUserApi()
  }, [])

  console.log(users)
  return pending
    ? <h2>Loading</h2>
    : (
      <>
        <Stack direction="horizontal" gap={3} className="p-2">
          <Fusion data={users} options={['username', '_id', 'name', 'email']} changeData={setUsers} />
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
            {users.length ? users.map((user: IuserSchema) =>
              <tr key={user._id}>
                <td className={`text-${theme.fontColor}`}> {user._id} </td>
                <td className={`text-${theme.fontColor}`}> {user.username} </td>
                <td className={`text-${theme.fontColor}`}> {user.email} </td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle disabled={user.privilage === 'owner'}>{user.privilage}</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => changeUserData(user._id, { privilage: "admin" })}>Admin</Dropdown.Item>
                      <Dropdown.Item onClick={() => changeUserData(user._id, { privilage: "user" })}>User</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle disabled={user.privilage === 'owner'}>{user.status}</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => changeUserData(user._id, { status: 'blocked' })}>block</Dropdown.Item>
                      <Dropdown.Item onClick={() => changeUserData(user._id, { status: 'unlocked' })}>unlock</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td><Button onClick={() => deleteUserFromDatabase(user._id)} variant='danger' disabled={user.privilage === 'owner'}> DELETE</Button></td>
              </tr>
            ) :
              <>{t('action.notfound')}</>}
          </tbody>
        </Table>
      </>
    )
}

export default Index