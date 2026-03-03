
export class addUser {
    useremail?: string
    groupid?: string
    userrole?: string
}


//Fivetran model

export class connect {
    service?: string
    group_id?: string
    run_setup_tests?: boolean
    trust_certificates?: false
    trust_fingerprints?: false
    paused?: boolean
    pause_after_trial?: boolean
    data_delay_sensitivity?: string
    sync_frequency?: number
    data_delay_threshold?: number
    config?: {
        schema: string
        schema_prefix?: string
        // table: string
        // show_reports_on_pbf: string

    }
}

export class getTokenModel {
    connector_id?: string
    name?: string
    designatedName?: string
}

export class filterPayload{
    connectorFilter?: any
}

export class checkUserData {
    connectorname?: string
    connectoruseremail?: string
}
export class adjustDB {
    name?: string
    useremail?: string
    datecreated?: string
    status?: string
    service?: string
    customattributes?: string
    payload_connector?: any;
}

export class generateReport {
    connector?: string
    project?: string
    source?: string
    run_env?: string
    dataset_location?:string
}

export class sendReport {
    receiverEmail?: string
    url?: string
}

export class verifyOTP{
    code?: string
    token?: string
}

export class ConfigResponse {
    Id?: string;
    EmbedUrl?: string;
    EmbedToken?: {
        Token: string;
    };
}

export class powerbiToken {
    workspace_id?: string
    report_id?: string
    dataset_id?: string
}

export class addReport {
    reportname?: string
    reportuseremail?: string
    client?: string
    reporttype?: string
    reportsource?: any;
    reportid?: string
    reportdatasetid?: string
    workspaceid?: string
    status?: string
    payload_connector?: any
    payload_dbt?: any
    payload_pbi?: any
    last_updated?: string
    reportconnectorname?: string
    is_custom_connector?: string
}
export class adjustPayload {
    adjustInput?: any
}

export class adjustFinal {
    from_date?: string
    to_date?: string
    gbq_project?: string
    gbq_dataset?: string
    cred_list?: any
    event_list?: Object
    tag?: string
    connector_id?: string
    schedule?: string
    gbq_location? : string
}
export class eventList {

}

export class gaPayload {
    from_date?: string
    to_date?: string
    gbq_project?: string
    gbq_dataset?: string
    client?: string
    view_info_list?: any
    tag?: string
    connector_id?: string
    schedule?: string
    user_id?: string
    gbq_location? : string

}

export class ga4Payload {
    from_date?: string
    to_date?: string
    gbq_project?: string
    gbq_dataset?: string
    client?: string
    property_info_list?: any
    tag?: string
    connector_id?: string
    schedule?: string
    user_id?: string
    gbq_location? : string

}

export class magentoPayload {
    from_date?: string
    to_date?: string
    gbq_project?: string
    gbq_dataset?: string
    client?: string
    magento_url?: string
    partners?: any
    tag?: string
    connector_id?: string
    schedule?: string
    gbq_location? : string
    
}
export class transformPayload {
    magento_database?: string
    magento_raw_schema?: string
    ga_raw_schema?: string
    magento_intermediate_schema?: string
    magento_reporting_schema?: string
    source?: string
    connector?: string
    run_env?: string
    dataset_location?: string
}

export class transformIntradayPayload {
    connector?: string
    gbq_convz_data_product?: string
    intraday?: string
    magento_raw_schema?: string
    ga4_raw_schema?: string
    adjust_raw_schema?: string
    currency_conversion?: string
    silver_schema?: string
    source?: string
    run_env?: string
    dataset_location?: string
}

//Ads source payload
export class adSourcePayload {
    run_var?: any
    run_env? : string
    source?: string
    connector?: string
    dataset_location?: string
}

export class pausePayload {
    reportId?: string
}