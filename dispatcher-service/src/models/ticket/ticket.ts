var mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    username: { type: String },
    clusterName: { type: String, required: true },
    location: { type: String },
    task: { type: String },
    numNodes: { type: Number },
    status: { type: String, required: true },
    startDate: { type: String, default: Date.now },
    endDate: { type: String },
    totalTime: {type: String },
    message: { type: String },
});

export const TicketModel = mongoose.model('TicketModel', ticketSchema);


export enum Status {
    PROVISIONING = "Provisioning",
    UPDATING = "Updating",
    DELETING = "Deleting",
    SUCCESS = "Success",
    FAILED = "Failed",
    ERROR = "Error"
}


// Also used in buildData of Deployment and given to OpenShift Workers
export enum Task {
    CREATE_ARTIFACT = 'createArtifact',
    MODIFY_ARTIFACT = 'modifyArtifact',
    DELETE_ARTIFACT = 'deleteArtifact'
}


// TODO add activeJobs?
export interface TicketObj {
    _id?: any, // Attached to document after save
    __v?: any,
    transactionId: String,
    username?: String,
    clusterName: String,
    location: String,
    task: Task,
    numNodes?: Number,
    status: Status,
    startDate: String,
    endDate?: String,
    totalTime?: String,
    message?: String
}


export class Ticket {
    ticketData: TicketObj;

    constructor(ticketData: TicketObj) {
        this.ticketData = ticketData;
    }

    public getTicketObj(): TicketObj {
        return this.ticketData;
    }

    public setValue(key: string, value: string): void {
        this.ticketData[key] = value;
    }

    public getValue(key: string): string {
        return this.ticketData[key];
    }

    public setStatus(status: Status): void {
        this.ticketData.status = status;
    }

    public getStatus(): Status {
        return this.ticketData.status;
    }
}


export class TicketDao {

    public async getAllTickets(): Promise<TicketObj[]> {
        return TicketModel.find({});
    }

    public async getTicketByModelId(_id: string): Promise<TicketObj> {
        var ticket = await TicketModel.findOne({ '_id': _id });
        return ticket;
    }

    public async getTicketsById(transactionId: string): Promise<TicketObj[]> {
        return TicketModel.find({ 'transactionId': transactionId });
    }

    public async getTicketsByUser(username: string): Promise<TicketObj[]> {
        return TicketModel.find({ 'username': username });
    }

    public async getTicketsByClusterName(name: string): Promise<TicketObj> {
        return TicketModel.find({'clusterName': name})
    }

    public async getLatestTicketById(transactionId: string): Promise<TicketObj> {
        return TicketModel.findOne({'transactionId': transactionId}, {}, { sort: { '_id': -1 }});
    }

    public saveTicket(ticketObj: TicketObj): Promise<TicketObj> {
        var ticket = new TicketModel(ticketObj);
        var savedTicket = ticket.save().catch(err => {
            console.log(`Error saving ticket with transactionId ${ticketObj.transactionId}`, err);
        });
        return savedTicket;
    }

    public deleteTicket(ticket: TicketObj): void {
        throw new Error("Method not implemented.");
    }
}