import { Client} from "#entity/advertisement_banner";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository} from "typeorm";
import { ClientFilter, ClientOutput } from "@modules/advertisment-banner/dtos";
import { BaseApiResponse, BasePaginationResponse } from "@modules/shared/dtos";
import { plainToClass, plainToInstance } from "class-transformer";
import { MESSAGES } from "@modules/shared/constants";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    private readonly dataSource: DataSource
  ) {}


  public async getClients(
    filter: ClientFilter,
  ): Promise<BasePaginationResponse<ClientOutput>> {
    const sqlQuery: string[] = [];
    const params: any[] = [];
  
    // Base SQL Query
    let baseQuery = `
      SELECT 
        c."ID" AS "id",
        c."NAME" AS "name",
        c."CONTACT_NUM" AS "contactNum",
        c."EMAIL_ADDRESS" AS "emailAddress",
        c."PAYMENT_METHOD" AS "paymentMethod",
        COALESCE(COUNT(rc."ID"), 0) AS "numberRentalContract"
      FROM "CLIENT" c
      LEFT JOIN "RENTAL_CONTRACT" rc ON rc."CLIENT_RID" = c."ID"::varchar
    `;
  
    // Build WHERE clause dynamically
    sqlQuery.push('WHERE c."SYS_FLAG" = $1');
    params.push('1'); // "SYS_FLAG" là kiểu character varying
  
    if (filter.contactNum) {
      sqlQuery.push('AND c."CONTACT_NUM" ILIKE $' + (params.length + 1));
      params.push(`%${filter.contactNum}%`);
    }
  
    if (filter.emailAddress) {
      sqlQuery.push('AND c."EMAIL_ADDRESS" ILIKE $' + (params.length + 1));
      params.push(`%${filter.emailAddress}%`);
    }
  
    if (filter.name) {
      sqlQuery.push('AND c."NAME" ILIKE $' + (params.length + 1));
      params.push(`%${filter.name}%`);
    }
  
    // Add GROUP BY and ORDER BY clauses
    baseQuery += `
      ${sqlQuery.join(' ')}
      GROUP BY c."ID", c."NAME", c."CONTACT_NUM", c."EMAIL_ADDRESS", c."PAYMENT_METHOD"
      ORDER BY c."CREATE_DATE" DESC
    `;
  
    // Add pagination using LIMIT and OFFSET
    baseQuery += `
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(filter.limit, filter.skip);
  
    // Execute the SQL query for clients
    const clients = await this.dataSource.query(baseQuery, params);
  
    // Count Query for Total Records
    const countQuery = `
      SELECT COUNT(DISTINCT c."ID") AS total
      FROM "CLIENT" c
      ${sqlQuery.join(' ')}
    `;
    const totalResult = await this.dataSource.query(countQuery, params.slice(0, params.length - 2)); // Exclude LIMIT & OFFSET
    const total = parseInt(totalResult[0].total, 10);
    console.log(clients)
    // Map result to DTO
    const clientsOutput: ClientOutput[] = clients.map((item: any) =>
      plainToInstance(ClientOutput, item, {
        excludeExtraneousValues: true,
      }),
    );
  
    return {
      listData: clientsOutput,
      total,
    };
  }
  
  public async getClientById(
    clientId: string,
  ): Promise<BaseApiResponse<ClientOutput>> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId, sysFlag: '1' },
    });
    if (!client) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CLIENT_NOT_EXIST,
        code: 4,
      });
    }
    const clientOutput = plainToClass(ClientOutput, client, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: clientOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }
  
}