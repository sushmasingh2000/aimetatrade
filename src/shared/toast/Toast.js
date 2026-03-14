import { Fail, QuestionO, Success } from '@react-vant/icons';
import { Toast } from 'react-vant';


function VantToast(message, condition) {
    return (Toast({
        message: message,
        icon: condition === "s" ? <Success /> : condition === "f" ? <Fail /> : <QuestionO />,
        className: 'custom-toast',
    })

    )
}

export default VantToast