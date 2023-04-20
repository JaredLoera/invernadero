// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
const { MongoClient, ObjectId } = require('mongodb')
const uri = 'mongodb+srv://abel0120:01abel01@cluster0.mndru6r.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useUnifiedTopology: true })

export default class InvernaderosController {
    
    async getInvernadero({response,params}) {
        try {
          await client.connect();
          const database = client.db('sistemaSensores');
          const collection = database.collection('invernaderos');
    
          const {id}=params;
      
          const invernadero = await collection.findOne({ _id: ObjectId(id) });
      
          if (!invernadero) {
            return response.status(400).json({
              status: 400,
              mensaje: 'No se encontro el invernadero',
              error: null,
          });
          }
          return invernadero;
    
        } catch (error) {
          console.log(error);
          throw new Error('Error al buscar el documento');
        } finally {
          await client.close();
        }
      }
    
      async getSensores({ response, params }) {
        try {
          await client.connect();
          const database = client.db('sistemaSensores');
          const collection = database.collection('sensores');
      
          const { id } = params;
      
          const sensores = await collection.findOne({ invernadero_id: id });
      
          if (sensores.length === 0) {
            return response.status(400).json({
              status: 400,
              mensaje: 'No se encontraron sensores para este invernadero',
              error: null,
            });
          }
      
          return sensores;
      
        } catch (error) {
          console.log(error);
          throw new Error('Error al buscar los sensores');
        } finally {
          await client.close();
        }
      }

      async getInverSen({ response, params }) {
        try {
          await client.connect();
          const database = client.db('sistemaSensores');
          const collection = database.collection('DatosSensores');
      
          const { nombre } = params;
      
          //const sensores = await collection.findOne({invernadero:nombre});

          const sensores = await collection.aggregate([
            {
              $match: {
                invernadero: nombre 
              }
            }
          ]).toArray();
          
      
          if (sensores.length === 0) {
            return response.status(400).json({
              status: 400,
              mensaje: 'No se encontraron sensores para este invernadero',
              error: null,
            });
          }
      
          return sensores;
      
        } catch (error) {
          console.log(error);
          throw new Error('Error al buscar los sensores');
        } finally {
          await client.close();
        }
      }
      
    
      async getInvernaderos({ response }) {
        try {
          await client.connect();
          const database = client.db('sistemaSensores');
          const collection = database.collection('invernaderos');
      
          const invernaderos = await collection.find({}).toArray();
      
          if (!invernaderos) {
            return response.status(400).json({
              status: 400,
              mensaje: 'No se encontraron invernaderos',
              error: null,
            });
          }
          return response.json({ datos: invernaderos })
          
        } catch (error) {
          console.log(error);
          throw new Error('Error');
        } finally {
          await client.close();
        }
      }
}
