//file that holds all permissions
export const enum PermissionKey {
  //USER PERMISSIONS

  ViewOwnUser = 'ViewOwnUser',
  UpdateOwnUser = 'UpdateOwnUser',
  DeleteOwnUser = 'DeleteOwnUser',
  ManageHours = 'ManageHours',

  //GESTOR PERMISSIONS\\

  ViewAnyUser = 'ViewAnyUser',
  ManageProjects = 'ManageProjects',
  ViewRoles = 'ViewRoles',
  ViewOwnProjects = 'ViewOwnProjects',

  //COMPANY ADMIN PERMISSIONS\\

  CreateUser = 'CreateUser',
  UpdateAnyUser = 'UpdateAnyUser',
  DeleteAnyUser = 'DeleteAnyUser',
  ManageClients = 'ManageClients',
  ViewAnyProject = 'ViewAnyProject',

  //ADMIN PERMISSIONS ONLY\\

  ManageRoles = 'ManageRoles',

}
