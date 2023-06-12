import FormResetPassword from 'components/forgot-my-password/formResetPassword';
import NoteCheckYourEmail from 'components/forgot-my-password/noteCheckYourEmail';
import React from 'react';

export default function ForgotPasswordPage() {

  const [content, setContent] = React.useState(1);
  
  return (
    <div>
      {content === 1 && <FormResetPassword changeContent={setContent} />}
      {content === 2 && <NoteCheckYourEmail changeContent={setContent} />}
    </div>
  );
}
