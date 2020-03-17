import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context){
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableName,
        // Key defines the partition and sort key of the item to be updated
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'notedId': path parameter
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: event.pathParameters.id
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the values in udpate expression
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
            ":content": data.content || null,
            ":attachment": data.attachment || null
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where 'ALL_NEW' returns all attributes of the item after the update;
        // you can inspect 'result' to see how it works with different settings
        ReturnValues: "ALL_NEW"
    };
    try{
        await dynamoDbLib.call("update", params);
        return success({ status : true });
    }catch (e){
        console.log(e);
        return failure({ status : false });
    }

}