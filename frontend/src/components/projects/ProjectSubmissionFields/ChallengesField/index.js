import { Grid } from '@material-ui/core'
import Select from 'components/inputs/Select'
import FormControl from 'components/inputs/FormControl'
import { FastField } from 'formik'
import React from 'react'

const ChallengesField = ({
    props,
    settings = {
        challengeOptions: [],
    },
}) => {
    const { challengeOptions } = settings
    return (
        <Grid item xs={12}>
            <FastField
                name="challenges"
                render={({ field, form }) => {
                    return (
                        <FormControl
                            label="Challenges"
                            hint="Which partner challenges do you want to submit your project in? You can choose up to 5. Note: make sure you read the event guidelines about how many challenges you can set here!"
                            touched={
                                form.touched[field.name] ||
                                props.submitCount > 0
                            }
                            error={form.errors[field.name]}
                        >
                            <div className="tw-bg-gray-100 tw-p-2 tw-rounded-md tw-border-gray-300 tw-border-solid tw-transition-all tw-duration-400 tw-border-2 hover:tw-bg-gray-300">
                                <Select
                                    label="Challenges"
                                    options={challengeOptions}
                                    value={field.value}
                                    onChange={value =>
                                        form.setFieldValue(field.name, value)
                                    }
                                    onBlur={() =>
                                        form.setFieldTouched(field.name)
                                    }
                                    isMulti
                                />
                            </div>
                        </FormControl>
                    )
                }}
            />
        </Grid>
    )
}
export default ChallengesField
