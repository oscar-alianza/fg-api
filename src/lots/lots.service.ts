import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class LotsService {
  constructor(private dataSource: DataSource) {}

  async findLot(itemCode: string, whsCode: string) {
    const query = `
      SELECT T0.BinAbs, T0.ItemCode, T0.OnHandQty, T1.WhsCode, T4.DistNumber 
      FROM [SBO_Alianza].dbo.OIBQ T0 
      INNER JOIN [SBO_Alianza].dbo.OBIN T1 
          ON T0.BinAbs = T1.AbsEntry 
          AND T0.onHandQty <> 0  
      LEFT OUTER JOIN [SBO_Alianza].dbo.OBBQ T2 
          ON T0.BinAbs = T2.BinAbs 
          AND T0.ItemCode = T2.ItemCode 
          AND T2.onHandQty <> 0 
      LEFT OUTER JOIN [SBO_Alianza].dbo.OBTN T4 
          ON T2.SnBMDAbs = T4.AbsEntry 
          AND T2.ItemCode = T4.ItemCode 
      WHERE T0.ItemCode LIKE @0 
          AND T1.WhsCode = @1 
          AND ISNULL(T4.DistNumber, '') <> ''

      UNION ALL

      SELECT T0.BinAbs, T0.ItemCode, T0.OnHandQty, T1.WhsCode, T4.DistNumber 
      FROM [SBO_Alianza].dbo.OIBQ T0 
      INNER JOIN [SBO_Alianza].dbo.OBIN T1 
          ON T0.BinAbs = T1.AbsEntry 
          AND T0.onHandQty <> 0  
      LEFT OUTER JOIN [SBO_Alianza].dbo.OSBQ T2 
          ON T0.BinAbs = T2.BinAbs 
          AND T0.ItemCode = T2.ItemCode 
          AND T2.onHandQty <> 0 
      LEFT OUTER JOIN [SBO_Alianza].dbo.OSRN T4 
          ON T2.SnBMDAbs = T4.AbsEntry 
          AND T2.ItemCode = T4.ItemCode 
      WHERE T0.ItemCode LIKE @0 
          AND T1.WhsCode = @1  
          AND ISNULL(T4.DistNumber, '') <> ''
    `;

    const lot = await this.dataSource.query(query, [`%${itemCode}%`, whsCode]);

    if (lot.length === 0)
      throw new NotFoundException(
        `We don't have a product with this code ${itemCode} in this wharehouse ${whsCode}`,
      );

    return lot;
  }
}
