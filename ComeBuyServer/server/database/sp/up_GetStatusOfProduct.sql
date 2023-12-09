DROP PROCEDURE IF EXISTS up_GetStatusOfProduct(productid IN text, rs OUT float);
CREATE OR REPLACE PROCEDURE up_GetStatusOfProduct(productid IN text, rs OUT float)
LANGUAGE 'plpgsql'
AS $$
DECLARE
	prod_id uuid;
	count1 float;
	count2 float;
BEGIN
   prod_id := productid;
   Select CAST(Count( distinct cmt1.commentid) as float) into count1 from comment cmt1 where prod_id = cmt1.productid and cmt1.status = 1 ;
   IF EXISTS (SELECT FROM comment cmt2 where prod_id = cmt2.productid) 
   THEN
   		Select CAST(Count( distinct cmt2.commentid) as float) into count2 from comment cmt2 where prod_id = cmt2.productid;
   ELSE count2 := 1.00;
   END IF;
   Select count1 / count2 into rs ;
END;
$$;