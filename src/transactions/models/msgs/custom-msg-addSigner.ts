import { MsgAddSigner } from '../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"

/**
 * Model representing a MsgAddSigner to send POKT from one account to another
 */
export class CustomMsgAddSigner extends TxMsg {
    public readonly fromAddress: string
    public readonly signer: string
    public readonly KEY: string = "/x.bridgepool.MsgAddSigner"
    public readonly AMINO_KEY: string = "bridgepool/msg_add_signer"

    /**
     * Constructor this message
     * @param {string} fromAddress - Origin address
     * @param {string} token - token
     * @param {string} amount - amount
     */
    public constructor(fromAddress: string, signer: string) {
        super()
        this.fromAddress = fromAddress
        this.signer = signer
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {object} - Msg type key value.
     * @memberof MsgAddSigner
     */
    public toStdSignDocMsgObj(): object {
        return { 
            type: this.AMINO_KEY, 
            value: { 
                signer: this.signer,
                fromAddress: this.fromAddress.toLowerCase(), 
            } 
        }
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgAddSigner
     */
    public toStdTxMsgObj(): any {
        const data = { 
            fromAddress: Buffer.from(this.fromAddress, "hex"),
            signer: this.signer,
        }

        const result = Any.fromJSON({
            "typeUrl": this.KEY,
            "value": Buffer.from(MsgAddSigner.encode(data).finish()).toString("base64")
        });

        return result;
    }

    static decodeStdTxMsgValue(value: string): any {
        return MsgAddSigner.decode(Buffer.from(value, 'base64'))
    }
}