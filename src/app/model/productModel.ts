export class activateUserPayload {
    userEmail?: string
    userMethod?: string
    tenantID?: any
}

export class refreshToken {
    userRefreshToken?: string
}

export class basicConnectorPayload {
    name?: string
    designatedName?: any;
}

export class customConnectorPayload {
    userId?: string
    name?: string
    service?: string
    payload_connector?: any;
    designatedName?: any;
}
export class addReport {
    reportname?: string
    userId?: string
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
    is_custom_connector?: string
    frequency?: string
    accesslist?: string[]
    template?: string
}
export class pauseConnect {
    conn_status?: string
    conn_id?: string
}

export class testPayload {
    name?: string
    email?: string
    designation?: string
}

export class updateReportPayload {
    reportId?: string
    userId?: string
}
export class syncStatePayload {
    project?: string
    identifier?: string
}
export class payPayload {
    userId?: string
    subscriptionChoice?: string
    paymentPlan?: string
}

export class upgradePayload {
    userId?: string
    newSubChoice?: string
    paymentPlan?: string
}

export class requestReportPayload {
    category?: string
    source?: string
    link?: string
}
export class requestConnectorPayload {
    name?: string
    description?: string
    link?: string
}

export class requestTemplatePayload {
    templateRequested?: string
}

export class requestDestinationPayload {
    name?: string
    region?: string
    subscription?: string
    description?: string
}

//Admin payload 

export class postOrgPayload {
    organizationName?: string
    organizationUrl?: string
    tenant?: string
}

export class cloneOrgPayload {
    clonedOrganizationId?: string
    newOrgName?: string
    newOrgAliasDomain?: string
}

export class brandOrgPayload {
    primaryColor?: string
    secondaryColor?: string
    fontColor?: string
}

export class inviteUserPayload {
    inviteeName?: string
    inviteeEmail?: string
}

export class postUserPayload {
    orgId?: string
    loginMethod?: string
    userEmail?: string
    userName?: string
    userRole?: string
}

export class templateAccessPayload {
    assignedTemplates: any
}

export class reportAccessPayload {
    reportId?: string
    permission?: string
    accessList?: any
    duration?: any
    startDuration?: string
    endDuration?: string
}

export class groupReportAccessPayload {
    reportId?: string
    permission?: string
    accessList?: any
}

export class updateDestPayload {
    destinationRegion?: string
    organizationId?: string
    mappedDestination?: string
}

export class postlogoPaylod {
    logo?: any
}

export class updateUserRolePayload {
    userId?: string
    organizationId?: string
    newRole?: string
}

export class updateRolePayload {
    userId?: string
    organizationId?: string
    newRole?: string
}
export class orgStatusPayload {
    organizationId?: string
}
export class updateRequestPayload {
    id?: string
}
export class userStatusPayload {
    userId?: string
    organizationId?: string
}

export class adminReportPayload {
    reportId?: string
    desiredStatus?: string
}

export class slackAlert {
    text?: string
}

export class embedReport {
    newReportName?: string
    newReportOwner?: string
    newReportType?: string
    workspaceId?: string
    reportId?: string
    reportDatasetId?: string
}

export class gptChat {
    user_prompt?: string
    dataset_id?: string
    workspace_id?: string
    user?: string
    gbq_project?: string
    report_id?: string
}

export class gbqChat {
    user_prompt?: string
    dataset_id?: string
    user?: string
    key?: any
}

export class acceptOrRejectRequest {
    groupId?: string
    requesterId?: string
    decision?: string
}

export class createGroup {
    groupName?: string
    groupDescription?: string
}

export class userLogsPayload {
    organizationId? : string
    startDate? :string
    endDate? : string
}





