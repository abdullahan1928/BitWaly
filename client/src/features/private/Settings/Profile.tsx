import DeleteAccount from './components/DeleteAccount'
import Preferences from './components/Preferences'
import Security from './components/Security'

const Profile = () => {
    return (
        <div className="flex flex-col gap-8">

            <Preferences />

            <Security />

            <DeleteAccount />

        </div>
    )
}

export default Profile