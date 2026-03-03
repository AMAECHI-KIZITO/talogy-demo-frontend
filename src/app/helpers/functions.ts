export function getDatasetId(temp: string, dataset: string): string {
    switch (temp.toLowerCase()) {
        case 'asana':
            return dataset + '_intermediate';
        case 'adjust':
            return dataset + '_intermediate';
        case 'intraday':
            return dataset + '_reporting';
        case 'ecommerce marketing':
            return dataset + '_reporting';
        case 'ad source':
            return dataset + '_ad_reporting';
        case 'pipedrive':
            return dataset + '_reporting';
        default:
            return dataset + '_reporting';
    }
}