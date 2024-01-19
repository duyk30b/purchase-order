import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsService } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export type GetTicketsRequest = {
  ids?: string[]
}

export type TicketType = {
  id: string
  code: string
  requestId?: string
  templateId?: string
  documentDate: string // ngày chứng từ
  status?: number
  type?: number
}

@Injectable()
export class NatsClientTicketService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getTickets(request: GetTicketsRequest) {
    if (request.ids?.length === 0) return {}
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.TICKET}.get_tickets_by_ids`,
      { ticketIds: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as TicketType[]
  }
}
