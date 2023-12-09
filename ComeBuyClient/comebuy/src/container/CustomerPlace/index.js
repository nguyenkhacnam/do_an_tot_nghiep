import React from 'react'
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


import NavBar from './../../components/NavBar/NavBar';

import { currentUser } from './../../redux/selectors'
import { BigFooter } from '../../components';


const CustomerPlace = () => {

    const navigate = useNavigate()
    const gotoProfile = () => {
        navigate('/profile')
    }
    const gotoCart = () => {
        navigate('/myplace/mycart')
    }
    const gotoFavorite = () => {
        navigate('/myplace/myfavorite')
    }

    const gotoOrder = () => {
        navigate('/myplace/myorders')
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <NavBar  ></NavBar>
            <div style={{ height: '100%', width: '100%' }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 12, sm: 12, md: 12 }}
                    style={{ marginTop: '9%', marginLeft: '3%', marginRight: '3%', flex: '1', }}
                >
                    {/* item 1 */}
                    <Card sx={{ width: 340, borderRadius: '15px', borderWidth: '2px', backgroundColor: 'black' }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="250"
                                image="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                                alt="centered image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" style={{ color: 'white', fontWeight: 'bold' }}>
                                    Your Orders
                                </Typography>
                                <Typography variant="body2" color="text.secondary" style={{ color: 'white' }}>
                                    Track, return, buy things again. Check your orders here. Let's see what you bought
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{ justifyContent: 'flex-end' }}>
                            <Button onClick={gotoOrder} style={{ color: 'white', fontWeight: 'bold' }} endIcon={<NavigateNextIcon />}>
                                Go to
                            </Button>
                        </CardActions>
                    </Card>

                    {/* item 2 */}
                    <Card sx={{ width: 340, borderRadius: '15px', borderWidth: '2px', backgroundColor: 'black' }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="250"
                                image="http://media.bizj.us/view/img/6577402/thinkstockphotos-478507910*1200xx2003-1130-0-189.jpg"
                                alt="centered image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" style={{ color: 'white', fontWeight: 'bold' }}>
                                    Your Cart
                                </Typography>
                                <Typography variant="body2" color="text.secondary" style={{ color: 'white' }}>
                                    Plan to buy, put your favorite into this by clicking adding cart in our product
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{ justifyContent: 'flex-end' }}>
                            <Button onClick={gotoCart} style={{ color: 'white', fontWeight: 'bold' }} endIcon={<NavigateNextIcon />}>
                                Go to
                            </Button>
                        </CardActions>
                    </Card>

                    {/* item 3 */}
                    <Card sx={{ width: 340, borderRadius: '15px', borderWidth: '2px', backgroundColor: 'black' }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="250"
                                image="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/touch-screen-laptops-1625594725.jpg"
                                alt="centered image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" style={{ color: 'white', fontWeight: 'bold' }}>
                                    Your favorite
                                </Typography>
                                <Typography variant="body2" color="text.secondary" style={{ color: 'white' }}>
                                    Add what you like into this bag. Waste no time to find it again
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{ justifyContent: 'flex-end' }}>
                            <Button onClick={gotoFavorite} style={{ color: 'white', fontWeight: 'bold' }} endIcon={<NavigateNextIcon />}>
                                Go to
                            </Button>
                        </CardActions>
                    </Card>

                    {/* item 4 */}
                    <Card sx={{ width: 340, borderRadius: '15px', borderWidth: '2px', backgroundColor: 'black' }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="250"
                                image="https://reflectoring.io/images/stock/0098-profile-1200x628-branded_huc871bff62bbbf27ac0fe6e66c8b066d4_38247_1400x0_resize_q90_box.jpg"
                                alt="centered image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" style={{ color: 'white', fontWeight: 'bold' }}>
                                    Your Profile
                                </Typography>
                                <Typography variant="body2" color="text.secondary" style={{ color: 'white' }}>
                                    How do people can recognize you ? Avatar, name, contact management.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{ justifyContent: 'flex-end' }}>
                            <Button onClick={gotoProfile} style={{ color: 'white', fontWeight: 'bold' }} endIcon={<NavigateNextIcon />}>
                                Go to
                            </Button>
                        </CardActions>
                    </Card>
                </Stack>
            </div>
            <BigFooter />
        </div>

    )
}

export default CustomerPlace