import uuid from 'uuid/v4'
import MainEntity, {IMainEntityData} from './entity/main'
import {IMainGateway} from './interface-gateways/IMain'
import {IPaginationQueryParams, IAggregatePagination, IGeneralGateway} from './interface-gateways/IGeneral'
import { validateHumanName } from '../delivery/helpers'
export {
  IMainEntityData,
  IMainGateway,
  IGeneralGateway,
  
  //general interfaces
  IPaginationQueryParams,
  IAggregatePagination
}
export default MainEntity({
  generateId: uuid,
  validateHumanName: validateHumanName
})