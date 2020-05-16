<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 2/18/2019
 * Time: 10:39 PM
 */

class Class_constant {

    //const URL = '//metadatasyst.com/gems/api/';
    //const URL = '//gems.globalfm.com.my/api/';
    const URL = '//localhost:8081/spdp_v2/api/';

    const ERR_DEFAULT = 'Error on system. Please contact Administrator!';
    const ERR_LOGIN_NOT_EXIST = 'Invalid Login ID or Password. Please try again.';
    const ERR_LOGIN_WRONG_PASSWORD = 'Invalid Login ID or Password. Please try again.';
    const ERR_LOGIN_BLOCK = 'You account has been blocked. Please retry after 10 minutes.';
    const ERR_RESET_SAME_PASSWORD = 'Password cannot be similar to previous';
    const ERR_LOGIN_NOT_ACTIVE = 'User ID is not active. Please contact Administrator to activate.';
    const ERR_USER_ALREADY_ACTIVATED = 'Your ID already activated.';
    const ERR_FORGOT_PASSWORD_NOT_EXIST = 'Email not exist';
    const ERR_CHANGE_PASSWORD_WRONG_CURRENT = 'Old password not correct';
    const ERR_CHANGE_PASSWORD_OLD_NEW_SAME = 'New password cannot be the same as old password';
    const ERR_ROLE_DELETE_HAVE_TASK = 'This user cannot be removed from this roles since there are still task assigned. Please delegate the task first.';
    const ERR_ROLE_DELETE_ALONE = 'There is no other user are assigned to this role. Please assign this role to new user before remove this user form this role.';
    const ERR_USER_ADD_SIMILAR_USERNAME = 'Login ID already registered. Please choose another ID.';
    const ERR_USER_ADD_SIMILAR_EMAIL = 'Email already registered. Please choose another email.';

    const SUC_FORGOT_PASSWORD = 'Your password successfully reset. Please login with temporary password sent to your email.';
    const SUC_CHANGE_PASSWORD = 'Your password has been changed';
    const SUC_RESET_PASSWORD = 'Your password successfully updated';
    const SUC_UPDATE_PROFILE = 'Your profile successfully updated';
    const SUC_EDIT_PASSWORD = 'Password successfully changed';

    const ERR_USER_DEACTIVATE = 'User already inactive';
    const ERR_USER_ACTIVATE = 'User already active';
    const ERR_USER_EXIST_IN_GROUP = 'User already registered in PPM / WO Group for current site. Please remove user from the group first to change site.';
    const ERR_TASK_ALREADY_SUBMITTED = 'This task already submitted';
    const ERR_TASK_CLAIMED = 'This task currently processed by other user';

    const SUC_SALES_ADD = 'Sales Data successfully added. Please continue update the slot data';
    const SUC_COUNTER_UPDATE = 'Slot Data successfully added and Sales Data has been calculated and updated';
    const SUC_ACTIVITY_ADD = 'New Activity successfully recorded';

    const ERR_SALES_EXIST = 'This site and machine already added. Please check the Sales Data list';
    const ERR_SALES_NO_PREVIOUS = 'No previous sales data to be copied. Please contact administrator';
}