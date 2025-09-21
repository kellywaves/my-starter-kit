import Auth from './Auth'
import RoleController from './RoleController'
import PermissionController from './PermissionController'
import UserController from './UserController'
import Settings from './Settings'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    RoleController: Object.assign(RoleController, RoleController),
    PermissionController: Object.assign(PermissionController, PermissionController),
    UserController: Object.assign(UserController, UserController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers