import MainEntity, {IMainEntityData, IMainGateway} from '../../domain'
import {IRequestMain} from '../boundaries/request/IMain'
import { IResponseMain } from '../boundaries/response/IMain'
import {IPaginationQueryParams} from '../../domain'
export default class MainUseCase {
  private entityGateway: IMainGateway
  // private responseBoundary: IResponseMain
  constructor (mainEntityGateway: IMainGateway) {
    this.entityGateway = mainEntityGateway
    // this.responseBoundary = responseBoundary
  }
  public mapEntityObject (data: IMainEntityData) {
    const mainEntityData = new MainEntity(data)
    return <IMainEntityData>{
      _id: mainEntityData.getId(),
      name: mainEntityData.getName(),
      isSuspended: mainEntityData.getIsSuspended(),
      createdAt: mainEntityData.getCreatedAt(),
      updatedAt: mainEntityData.getUpdatedAt(),
    }
  }
  public async saveMain (data: IMainEntityData) {
    const newMainEntity = this.entityGateway.insertOne(this.mapEntityObject(data))
    // this.responseBoundary.presentMain(newMainEntity)
    return newMainEntity
  }
  /**
   * get main list
   * @param queryParams 
   */
  public async findAllMain (queryParams: Omit<IPaginationQueryParams<IMainEntityData>, 'searchFields'>) {
    const {limitTo, searchText, startAt} = queryParams
    return this.entityGateway.aggregateWithPagination([], {
      ...queryParams,
      searchFields: ['name']
    })
  }
  public async updateMainById (id: string, data: IMainEntityData) {
    const {name} = this.entityGateway.insertOne(this.mapEntityObject(data))
    return this.entityGateway.updateById(id, {name})
  }
}