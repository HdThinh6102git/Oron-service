import { FileRelatedMorph, File } from "#entity/file";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFileInput, CreateFileRelatedMorphInput, FileOutput} from "../dtos";
import { v4 as uuidv4 } from 'uuid';
import { plainToInstance } from "class-transformer";

@Injectable()
export class FileService{
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
    @InjectRepository(FileRelatedMorph)
    private fileRelatedMorphRepo: Repository<FileRelatedMorph>,
  ) {}

  public async createNewFile(
    userId: string,
    fileInput: CreateFileInput,
    fileRelatedMorphInput: CreateFileRelatedMorphInput
  ) {

    //Assign the system fields 
    fileInput.createBy = userId;
    fileInput.modifyBy = userId;
    fileInput.createDate = new Date();
    fileInput.modifyDate = new Date();
    fileInput.sysFlag = '1';
    await this.fileRepo.save(fileInput);

    //Assign the system fields
    fileRelatedMorphInput.id = uuidv4().replace(/-/g, '');
    fileRelatedMorphInput.createBy = userId;
    fileRelatedMorphInput.modifyBy = userId;
    fileRelatedMorphInput.createDate = new Date();
    fileRelatedMorphInput.modifyDate = new Date();
    fileRelatedMorphInput.sysFlag = '1';
    

    await this.fileRelatedMorphRepo.save(fileRelatedMorphInput);

  }

  public async getRelatedFile(
    realtedRid: string,
    relatedType: string,
  ): Promise<FileOutput | null> {
    //Get fileRid related file data
    const fileRelatedMorph = await this.fileRelatedMorphRepo.findOne({
      where: {
        relatedRid: realtedRid,
        relatedType: relatedType,
        sysFlag: '1'
      },
    });
    let fileObject = null;
    if (fileRelatedMorph) {
      const file = await this.fileRepo.findOne({
        where: {
          id: fileRelatedMorph.fileRid,
          sysFlag: '1',
        },
      });
  
      // Map file to FileOutput if it exists
      if (file) {
        fileObject = plainToInstance(FileOutput, {
          url: file.url,
          alternativeText: file.alternativeText,
        });
      }
    }
    return fileObject;
  }

}