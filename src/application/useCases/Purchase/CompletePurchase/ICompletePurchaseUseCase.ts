import { IPurchaseRepository } from '@domain/repositories/IPurchaseRepository';
import { ICompletePurchaseDTO, ICompletePurchaseResponse, PurchaseHasNoOwnerErrorResponse } from './ICompletePurchaseDTO';
import { IPaymentProvider } from '@domain/providers/Payment/IPaymentProvider';
import { ISaveDeliveryUseCase } from '@application/useCases/Delivery/SaveDelivery/ISaveDeliveryUseCase';
import { Purchase } from '@domain/entities/Purchase';
import { IRetrieveResponse } from '@domain/providers/Payment/Payment';

export class ICompletePurchaseUseCase {
  constructor(
    private readonly iPurchaseRepository: IPurchaseRepository,
    private readonly iPaymentProvider: IPaymentProvider,
    private readonly iSaveDeliveryUseCase: ISaveDeliveryUseCase
  ) {}

  async execute({
    purchase_id,
    session_id,
  }: ICompletePurchaseDTO): Promise<ICompletePurchaseResponse> {
    const owner: Pick<Purchase, 'buyer_id'> | null =
      await this.iPurchaseRepository.findPurchaseOwner({
        purchase_id,
      });

    if (!owner) return new PurchaseHasNoOwnerErrorResponse();

    const { 
      buyer_id 
    } = owner;
    const session: IRetrieveResponse = await this.iPaymentProvider.retrieve(
      session_id,
      {
        expand: ['payment_intent.payment_method'],
      }
    );

    const { 
      customer_details 
    } = session;

    await this.iSaveDeliveryUseCase.execute({
      purchase_id,
      buyer_id,
      country: customer_details?.address?.country ?? '',
      city: customer_details?.address?.city ?? '',
      recipient_email: customer_details?.email ?? '',
      recipient_name: customer_details?.name ?? '',
      recipient_phone: customer_details?.phone,
      state: customer_details?.address?.state ?? '',
      address_line1: customer_details?.address?.line1 ?? '',
      address_line2: customer_details?.address?.line2,
      postal_code: customer_details?.address?.postal_code ?? '',
    });

    await this.iPurchaseRepository.completePurchase({
      purchase_id,
      payment_method: 'Card',
    });

    return {
      success: true
    }
  }
}
