import { Typography } from '@material-ui/core'
import ParticipantPreview from 'components/Participant/ParticipantPreview'
import team from 'pages/_dashboard/renderDashboard/generalPages/team'
import React from 'react'

export default ({
    viewModeStyle = 'list',
    teamMembers = [],
    enabledTeamMemberView = false,
}) => {
    return (
        <div className="tw-flex tw-flex-col tw-gap-4">
            <Typography
                className="tw-tracking-tight tw-font-medium"
                variant="h5"
                component="h5"
            >
                Team members
            </Typography>
            {teamMembers?.map((member, index) => {
                return (
                    <ParticipantPreview
                        key={index}
                        viewMode={viewModeStyle}
                        userData={member}
                        enabledView={enabledTeamMemberView}
                    />
                )
            })}
        </div>
    )
}
