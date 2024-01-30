import DeleteAccount from './components/DeleteAccount'
import Preferences from './components/Preferences'
import Security from './components/Security'

const Profile = () => {
    return (
        <div className="flex flex-col gap-8">

            <Preferences />

            <hr className="my-4 border-gray-400" />

            <Security />

            <hr className="my-4 border-gray-400" />

            <DeleteAccount />

        </div>
    )
}

export default Profile