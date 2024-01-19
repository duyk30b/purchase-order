import { sleep } from '@nestcloud/common'
import { Injectable, Logger } from '@nestjs/common'
import { NatsClientUserService } from './components/transporter/nats/service/nats-client-user.service'
import { INSERT_PERMISSION } from './core/guard/permission'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  constructor(private readonly natsClientUserService: NatsClientUserService) {}

  async onModuleInit() {
    this.logger.log('------- Init Module -------')
    await this.updatePermissions()
  }

  getHello(): string {
    return 'Hello World!'
  }

  async updatePermissions() {
    const maxRetry = 6
    let success = false
    let number = 1
    do {
      try {
        await this.natsClientUserService.insertPermission(INSERT_PERMISSION)
        await this.natsClientUserService.deletePermissionNotActive()
        success = true
        this.logger.log('Update Permissions success !!!')
      } catch (err) {
        number++
        await sleep(5000)
      }
    } while (!success && number < maxRetry)
  }
}
