export const prCreationStatuses = ['BELUM_DIBUAT_PR', 'SEBAGIAN_DIBUAT_PR', 'SUDAH_DIBUAT_PR'] as const;
export type PrCreationStatus = (typeof prCreationStatuses)[number] | 'DATA_MAPPING_EXCEPTION';

export function classifyPrCreationStatus(releasedPrCount: number, finalPrCount: number): PrCreationStatus {
  if (finalPrCount > releasedPrCount) return 'DATA_MAPPING_EXCEPTION';
  if (releasedPrCount === 0 || finalPrCount === 0) return 'BELUM_DIBUAT_PR';
  if (finalPrCount < releasedPrCount) return 'SEBAGIAN_DIBUAT_PR';
  return 'SUDAH_DIBUAT_PR';
}
