import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { TextField, Checkbox, ListItem, Box, IconButton } from '@mui/material';
import { KeyboardDoubleArrowUp } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';
import { setEventsData } from '../../../redux/actions/eventAction';
import IconMenu from './IconMenu';
import EventDetail from './EventDetail';

type Tprops = {
    eventId: number;
    eventData: type.eventData;
}

type TServerEventsData = {
    Success: boolean,
    eventData: {
        id: number;
        description: string;
        isChecked: boolean;
    }[]
};

const Event = (props: Tprops) => {
    const {eventId, eventData} = props

    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {CurDailyData, TargetElement} = useSelector((state: RootState) => state.dailyReducer);
    
    const setEvents = useCallback(
        (eventsData: type.eventData[]) => dispatch(setEventsData(eventsData)),
        [dispatch]
    );

    const [Checked, setChecked] = useState<boolean>(eventData.isChecked);
    const [IconMenuOpened, setIconMenuOpened] = useState<null | HTMLElement>(null);
    const [EventDetailOpened, setEventDetailOpened] = useState<boolean>(false);

    // 이벤트 서브 메뉴 열기
    const iconMenuOpenHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        setIconMenuOpened(e.currentTarget);
    };
    
    // 이벤트 서브 메뉴 닫기
    const iconMenuCloseHandler = () => {
        if(IconMenuOpened && TargetElement) {
            return;
        }
        setIconMenuOpened(null);
    };

    const eventDetailOpenHandler = () => {
        setEventDetailOpened(true);
    };
    
    const eventDetailCloseHandler = () => {
        setEventDetailOpened(false);
        iconMenuCloseHandler();
    };

    // 이벤트 체크
    const onEventCheckHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        changeEventCheck();
    };

    // 이벤트 전체 조회
    const getEvents = async() => {
        if(CurUserData && CurDailyData){
            await api().get<TServerEventsData>(`/events/getEvents/${CurUserData.id}/${CurDailyData.id}`)
            .then(res => {
                setEvents(res.data.eventData);
            }).catch(Error => {
                console.log(Error);
            });
        }
    };
    
    // 이벤트 수정
    const updateEvent = async(value: string) => {
        if(!CurUserData || !eventId) {
            return;
        }
        let body = {
            description: value
        }
        await api().patch(`/events/${eventId}`, body)
        .then(res => {
        }).catch(Error => {
            console.log(Error);
        });
    };

    // 이벤트 체크 수정
    const changeEventCheck = async() => {
        if(!CurUserData || !eventId) {
            return;
        }
        await api().patch(`/events/check/${eventId}`)
        .then(res => {
            getEvents();
        }).catch(Error => {
            console.log(Error);
        });
    };

    // 이벤트 수정 텍스트 업데이트
    const eventUpdateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        updateEvent(e.currentTarget.value);
    };

    useEffect(() => {
        iconMenuCloseHandler();
    }, [TargetElement])
    
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (
        <ListItem
            sx={{pt:0, pb: 0, flexDirection: 'column'}}
            component="div"
            aria-label="event-list"
            onMouseEnter={iconMenuOpenHandler}
            onMouseLeave={iconMenuCloseHandler}
        >
            <Box className='event_title_box'>
                <Checkbox 
                    {...label} 
                    checked={Checked} 
                    color="success" 
                    onChange={onEventCheckHandler}
                    
                />
                <TextField
                    sx={{maxWidth: 271}}
                    fullWidth
                    variant="standard"
                    defaultValue={eventData.description}
                    key={eventData.description}
                    onChange={eventUpdateHandler}
                    onClick={eventDetailOpenHandler}
                    
                />
                {Boolean(IconMenuOpened) && 
                    <IconMenu eventId={eventId} />
                }
            </Box>
            {EventDetailOpened &&
                <EventDetail eventDetailCloseHandler={eventDetailCloseHandler}/>
            }
        </ListItem>
    );
};

export default Event;