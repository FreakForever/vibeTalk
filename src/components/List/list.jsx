import './list.css'
import Userinfo from "/src/components/List/userInfo/userInfo.jsx"
import ChatList from './chatList/chatList'


const List = () => {
  return (
    <div className='list'>
      <Userinfo/>
      <ChatList />
    </div>
  )
}

export default List
