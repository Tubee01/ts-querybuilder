import { EntityModel } from './lib/models/entity';
import { Order } from './lib/query-builder';

(async () => {
  const entityModel = new EntityModel();
  const entity = await entityModel.create({ data: { name: 'test', parentId: null }, returning: ['name'] });

  console.log(entity);

  const entities = await entityModel.find({
    select: ['id', 'name'],
    order: [
      {
        column: 'name',
        direction: Order.ASC,
      },
      {
        column: 'id',
        direction: Order.DESC,
      },
    ],
  });

  console.log(entities);

  await entityModel.update({
    data: {
      name: 'tezsvír',
    },
    where: {
      name: {
        eq: 'teszvír',
      },
    },
  });

  const entities_1 = await entityModel.find({
    where: {
      name: {
        contains: 'tezs',
      },
    },
  });

  // await entityModel.delete();

  console.log(entities_1);

  process.exit(0);
})();
