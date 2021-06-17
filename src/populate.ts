import { RoleRepository, UserRepository, UserCalendarRepository, HoursRepository, ClientsRepository, ProjectRepository } from './repositories';

import { HoursManagerDataSource } from './datasources';
import * as mockUsers from './mock-data/users.json';
import * as mockRoles from './mock-data/roles.json';
import * as mockUserCalendar from './mock-data/user-calendar.json';
import * as mockHours from './mock-data/hours.json';
import * as mockClients from './mock-data/clients.json';
import * as mockProjects from './mock-data/projects.json';


import { User, Role, UserCalendar, Hours, Clients, Project } from './models';
import { PermissionKey } from './authorization/permission-key';

const db = new HoursManagerDataSource();
let rolesIDs: string[] = [];
let userCalendarID: string = "";
let userIDs: string[] = [];
let clientID: string[] = [];
let projectIDs: string[] = [];


export async function populate() {

  console.log('Deleting database mock data...');
  await deleteMockData()

  console.log('Populating database with mock data...');
  await createMockData();


  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

async function createMockData(): Promise<void> {

  await createUserCalendar();
  await createRoles();
  await createUsers();
  await createClients();
  await createProjects();
  await createHours();

}

async function deleteMockData(): Promise<void> {
  const usersRepo = new UserRepository(db);
  const roleRepo = new RoleRepository(db);
  const userCalendarRepository = new UserCalendarRepository(db);
  const hoursRepository = new HoursRepository(db);
  const clientsRepository = new ClientsRepository(db);
  const projectRepository = new ProjectRepository(db);


  await usersRepo.deleteAll()
  await roleRepo.deleteAll()
  await userCalendarRepository.deleteAll()
  await hoursRepository.deleteAll()
  await clientsRepository.deleteAll()
  await projectRepository.deleteAll()

}

async function createUsers(): Promise<void> {
  const usersRepo = new UserRepository(db);
  const roleRepo = new RoleRepository(db);
  const usersLength = mockUsers.length;
  for (let i = 0; i < usersLength; i++) {
    //Check if Users from the Mock Data exist
    const dataObj = await usersRepo.findOne(
      {
        where: {
          email: mockUsers[i].email,
        },
      },
      { useQuerystring: true },
    );

    if (dataObj) {
      console.log('Users from Mock Data already exists');
    } else {
      const iReal = i + 1;

      //Configuration to encrypt password
      const bcrypt = require('bcryptjs');
      const salt = bcrypt.genSaltSync(10);

      const userObj = new User({
        name: mockUsers[i].name,
        userCalendarID: userCalendarID,
        email: mockUsers[i].email,
        password: bcrypt.hashSync(mockUsers[i].password, salt),
        rolesID: mockUsers[i].name === "User 1 - Admin" ? [rolesIDs[1]] : [rolesIDs[0]]
      });

      const roles = await roleRepo.find({ where: { id: mockUsers[i].name === "User 1 - Admin" ? rolesIDs[1] : rolesIDs[0] } })
      let totalPermissions: PermissionKey[] = []
      roles.map(role => {
        totalPermissions = totalPermissions.concat(role.permissions)
      })
      const uniqueSet = new Set(totalPermissions)
      userObj.permissions = [...uniqueSet]
      const user = await usersRepo.create(userObj)
      userIDs.push(user.id!)

      console.log('User ' + iReal + ' created with id ' + user.id);
    }
  }
}

async function createRoles(): Promise<void> {
  const roleRepo = new RoleRepository(db);

  const rolesLength = mockRoles.length;
  for (let i = 0; i < rolesLength; i++) {
    //Check if Users from the Mock Data exist
    const dataObj = await roleRepo.findOne(
      {
        where: {
          role: mockRoles[i].role,
        },
      },
      { useQuerystring: true },
    );

    if (dataObj) {
      console.log('Role from Mock Data already exists');
    } else {
      const iReal = i + 1;

      const roleObj = new Role({
        role: mockRoles[i].role,
        permissions: mockRoles[i].permissions as PermissionKey[],
      });

      const role = await roleRepo.create(roleObj);
      rolesIDs.push(role.id!)
      console.log('Role ' + iReal + ' created with role ' + roleObj.role);

    }
  }
}

async function createUserCalendar(): Promise<void> {
  const userCalendarRepository = new UserCalendarRepository(db);

  const mockUserCalendarLength = mockUserCalendar.length;
  for (let i = 0; i < mockUserCalendarLength; i++) {
    const dataObj = await userCalendarRepository.findOne(
      {
        where: {
          name: mockUserCalendar[i].name,
        },
      },
      { useQuerystring: true },
    );

    if (dataObj) {
      console.log('User Calendar from Mock Data already exists');
    } else {
      const iReal = i + 1;

      const userCalendarObj = new UserCalendar({
        name: mockUserCalendar[i].name,
        schedule: mockUserCalendar[i].schedule,
      });
      const userCalendar = await userCalendarRepository.create(userCalendarObj);
      userCalendarID = userCalendar.id!
      console.log('User Calendar ' + iReal + ' created with id ' + userCalendar.id);
    }
  }
}

async function createHours(): Promise<void> {
  const hoursRepository = new HoursRepository(db);

  const hoursLength = mockHours.length;
  for (let i = 0; i < hoursLength; i++) {
    const dataObj = await hoursRepository.findOne(
      {
        where: {
          date: new Date(mockHours[i].date),
        },
      },
      { useQuerystring: true },
    );

    if (dataObj) {
      console.log('Hour from Mock Data already exists');
    } else {
      const iReal = i + 1;

      const HourtsObj = new Hours({
        date: new Date(mockHours[i].date),
        userId: userIDs[0],
        number_hours: mockHours[i].number_hours,
        idProject: projectIDs[0]
      });
      const hours = await hoursRepository.create(HourtsObj);
      console.log('Hours ' + iReal + ' created with id ' + hours.id);
    }
  }
}

async function createClients(): Promise<void> {
  const clientsRepository = new ClientsRepository(db);

  const clientsLength = mockClients.length;
  for (let i = 0; i < clientsLength; i++) {
    const dataObj = await clientsRepository.findOne(
      {
        where: {
          name: mockClients[i].name,
        },
      },
      { useQuerystring: true },
    );

    if (dataObj) {
      console.log('Client from Mock Data already exists');
    } else {
      const iReal = i + 1;

      const clientObj = new Clients({
        name: mockClients[i].name,
        web: mockClients[i].web,
        email: mockClients[i].email,
        phone: mockClients[i].phone
      });
      const client = await clientsRepository.create(clientObj);
      clientID.push(client.id!);
      console.log('Client ' + iReal + ' created with id ' + client.id);
    }
  }
}

async function createProjects(): Promise<void> {
  const projectRepository = new ProjectRepository(db);

  const projectsLength = mockProjects.length;
  for (let i = 0; i < projectsLength; i++) {
    const dataObj = await projectRepository.findOne(
      {
        where: {
          name: mockProjects[i].name,
        },
      },
      { useQuerystring: true },
    );

    if (dataObj) {
      console.log('Project from Mock Data already exists');
    } else {
      const iReal = i + 1;

      const projectObj = new Project({
        name: mockProjects[i].name,
        idClient: clientID[0],
        estimatedHours: mockProjects[i].estimatedHours,
        initialDate: new Date(),
        endDate: new Date(mockProjects[i].endDate),
        userIDs: mockProjects[i].name === "ProyectoTest1" ? [userIDs[0], userIDs[1]] : [userIDs[2], userIDs[3], userIDs[4]]
      });
      const project = await projectRepository.create(projectObj);
      projectIDs.push(project.id!);
      console.log('Project ' + iReal + ' created with id ' + project.id);
    }
  }
}

populate().catch(err => {
  console.error('Cannot populate database', err);
  process.exit(1);
});
