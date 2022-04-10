import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Role from 'App/Enums/Roles'
import Booking from 'App/Models/Booking'
import Suite from 'App/Models/Suite'
import User from 'App/Models/User'

export default class DashboardPolicy extends BasePolicy {
  public async viewEstablishments(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async createEstablishment(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async storeEstablishment(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async editEstablishment(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async updateEstablishment(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async deleteEstablishment(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async destroyEstablishment(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async viewManagers(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async createManager(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async storeManager(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async editManager(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async updateManager(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async deleteManager(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async destroyManager(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async viewMessages(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async deleteMessage(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async destroyMessage(user: User) {
    return user.roleId === Role.ADMIN
  }

  public async viewSuites(user: User) {
    return user.roleId === Role.MANAGER
  }

  public async createSuite(user: User) {
    return user.roleId === Role.MANAGER
  }

  public async storeSuite(user: User) {
    return user.roleId === Role.MANAGER
  }

  public async editSuite(user: User, suite: Suite) {
    await suite.load('establishment')
    return user.id === suite.establishment.userId && user.roleId === Role.MANAGER
  }

  public async updateSuite(user: User, suite: Suite) {
    await suite.load('establishment')
    return user.id === suite.establishment.userId && user.roleId === Role.MANAGER
  }

  public async deleteSuite(user: User, suite: Suite) {
    await suite.load('establishment')
    return user.id === suite.establishment.userId && user.roleId === Role.MANAGER
  }

  public async destroySuite(user: User, suite: Suite) {
    await suite.load('establishment')
    return user.id === suite.establishment.userId && user.roleId === Role.MANAGER
  }

  public async storeBooking(user: User) {
    return user.roleId === Role.USER
  }

  public async viewBookings(user: User) {
    return user.roleId === Role.USER
  }

  public async deleteBooking(user: User, booking: Booking) {
    return user.id === booking.userId && user.roleId === Role.USER
  }

  public async destroyBooking(user: User, booking: Booking) {
    return user.id === booking.userId && user.roleId === Role.USER
  }

  public async viewSettings(user: User) {
    return user.roleId === Role.USER
  }

  public async updateSettings(user: User) {
    return user.roleId === Role.USER
  }
}
