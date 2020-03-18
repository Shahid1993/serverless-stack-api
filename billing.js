import stripePackage from "stripe";
import { calculateCost } from "./libs/billing-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context){
    //const { storage, source } = JSON.parse(event.body);
    const data = JSON.parse(event.body);
    const amount = calculateCost(data.storage);
    const source = data.source;
    const description = data.description;
    const shipping = data.shipping;

    // Load our secret key from the environment variables
    const stripe = stripePackage(process.env.stripeSecretKey);
    try{
        await stripe.charges.create({
            source,
            amount,
            currency: "usd",
            description,
            shipping
        });
        return success({ status : true});
    }catch (e){
        return failure({ message: e.message });
    }
}